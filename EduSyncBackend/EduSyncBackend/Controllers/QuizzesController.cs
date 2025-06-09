using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore; // Needed for Include()
using EduSyncBackend.Models;
using EduSyncBackend.Data;
using EduSyncBackend.DTOs;
using System.Collections.Generic;
using System.Linq;
using Newtonsoft.Json;
using System;
using System.Text;
using System.Threading.Tasks;

// Add these for Event Hubs
using Azure.Messaging.EventHubs;
using Azure.Messaging.EventHubs.Producer;
using Microsoft.Extensions.Configuration;

namespace EduSyncBackend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class QuizzesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IConfiguration _config;

        public QuizzesController(ApplicationDbContext context, IConfiguration config)
        {
            _context = context;
            _config = config;
        }

        // 1. Create Quiz
        [HttpPost]
        public IActionResult CreateQuiz([FromBody] QuizDto dto)
        {
            var quiz = new Quiz
            {
                Title = dto.Title,
                Description = dto.Description,
                DueDate = dto.DueDate,
                CourseId = dto.CourseId
            };
            _context.Quizzes.Add(quiz);
            _context.SaveChanges();
            return Ok(new { id = quiz.Id });
        }

        // 2. Add Questions to Quiz
        [HttpPost("{quizId}/questions")]
        public IActionResult AddQuestions(int quizId, [FromBody] List<QuizQuestionDto> questions)
        {
            var quizQuestions = questions.Select(q => new QuizQuestions
            {
                QuizId = quizId,
                QuestionText = q.QuestionText,
                QuestionType = q.QuestionType,
                OptionsJson = q.Options != null ? JsonConvert.SerializeObject(q.Options) : null,
                CorrectAnswer = q.CorrectAnswer
            }).ToList();

            _context.QuizQuestions.AddRange(quizQuestions);
            _context.SaveChanges();
            return Ok();
        }

        [HttpPost("{quizId}/submit")]
        public IActionResult SubmitQuiz(int quizId, [FromBody] QuizSubmissionDto dto)
        {
            var questions = _context.QuizQuestions.Where(q => q.QuizId == quizId).ToList();
            int score = 0;

            // Prevent duplicate submissions (optional)
            var alreadySubmitted = _context.QuizSubmissions
                .Any(s => s.QuizId == quizId && s.StudentId == dto.StudentId);
            if (alreadySubmitted)
            {
                return BadRequest(new { message = "You have already submitted this quiz." });
            }

            var submission = new QuizSubmission
            {
                QuizId = quizId,
                StudentId = dto.StudentId,
                SubmittedAt = DateTime.UtcNow,
                Score = 0,
                Answers = new List<QuizAnswer>()
            };

            foreach (var answer in dto.Answers)
            {
                var question = questions.FirstOrDefault(q => q.Id == answer.QuestionId);
                if (question != null && question.QuestionType == "MCQ" && question.CorrectAnswer == answer.AnswerText)
                {
                    score++;
                }

                submission.Answers.Add(new QuizAnswer
                {
                    QuizQuestionId = answer.QuestionId,
                    AnswerText = answer.AnswerText
                });
            }
            submission.Score = score;

            _context.QuizSubmissions.Add(submission);
            _context.SaveChanges();

            // ---- Event Hubs integration (non-blocking) ----
            try
            {
                string connectionString = _config["EventHub:ConnectionString"];
                string eventHubName = _config["EventHub:Name"];

                var eventObj = new
                {
                    quizId,
                    studentId = dto.StudentId,
                    score,
                    submittedAt = submission.SubmittedAt,
                    answers = dto.Answers
                };
                var eventBody = Encoding.UTF8.GetBytes(System.Text.Json.JsonSerializer.Serialize(eventObj));

                // Fire-and-forget async sending
                Task.Run(async () =>
                {
                    await using var producerClient = new EventHubProducerClient(connectionString, eventHubName);
                    using EventDataBatch eventBatch = await producerClient.CreateBatchAsync();
                    eventBatch.TryAdd(new EventData(eventBody));
                    await producerClient.SendAsync(eventBatch);
                });
            }
            catch (Exception ex)
            {
                // Optionally log: Event Hubs failure does not break quiz submission
            }
            // -----------------------------------------------

            return Ok(new { message = "Submission received!", score });
        }

        // GET: /api/courses/{courseId}/quizzes
        [HttpGet("/api/courses/{courseId}/quizzes")]
        public IActionResult GetQuizzesForCourse(int courseId)
        {
            var quizzes = _context.Quizzes
                .Where(q => q.CourseId == courseId)
                .Select(q => new
                {
                    id = q.Id,
                    title = q.Title,
                    description = q.Description,
                    dueDate = q.DueDate
                })
                .ToList();

            return Ok(quizzes);
        }

        // GET: /api/quizzes/{quizId}
        [HttpGet("{quizId}")]
        public IActionResult GetQuiz(int quizId)
        {
            var quiz = _context.Quizzes
                .Where(q => q.Id == quizId)
                .Select(q => new
                {
                    id = q.Id,
                    title = q.Title,
                    description = q.Description,
                    dueDate = q.DueDate,
                    questions = q.Questions.Select(qq => new
                    {
                        id = qq.Id,
                        questionText = qq.QuestionText,
                        questionType = qq.QuestionType,
                        options = qq.QuestionType == "MCQ" && qq.OptionsJson != null
                            ? Newtonsoft.Json.JsonConvert.DeserializeObject<List<string>>(qq.OptionsJson)
                            : null
                    }).ToList()
                })
                .FirstOrDefault();

            if (quiz == null) return NotFound();
            return Ok(quiz);
        }

        [HttpGet("/api/instructor/{instructorId}/quizzes-with-results")]
        public IActionResult GetInstructorQuizzesWithResults(int instructorId)
        {
            // Get all courses taught by this instructor
            var courseIds = _context.Courses
                .Where(c => c.InstructorId == instructorId)
                .Select(c => c.Id)
                .ToList();

            // Get all quizzes for these courses, including course and submissions
            var quizzes = _context.Quizzes
                .Include(q => q.Course)
                .Where(q => courseIds.Contains(q.CourseId))
                .Select(q => new
                {
                    id = q.Id,
                    title = q.Title,
                    course = q.Course != null ? q.Course.Name : "N/A",
                    submissions = _context.QuizSubmissions
                        .Where(s => s.QuizId == q.Id)
                        .Include(s => s.Student) // Assuming you have a navigation property
                        .Select(s => new
                        {
                            studentId = s.StudentId,
                            studentName = s.Student != null ? s.Student.Name : "Unknown",
                            submittedAt = s.SubmittedAt,
                            score = s.Score
                        }).ToList()
                })
                .ToList();

            return Ok(quizzes);
        }

        // GET: /api/student/{studentId}/quizzes
        [HttpGet("/api/student/{studentId}/quizzes")]
        public IActionResult GetStudentQuizzes(int studentId)
        {
            // Find all course IDs the student is enrolled in
            var enrolledCourseIds = _context.Enrollments
                .Where(e => e.UserId == studentId)
                .Select(e => e.CourseId)
                .ToList();

            // Find all quizzes for those courses (with Course navigation property loaded)
            var quizzes = _context.Quizzes
                .Include(q => q.Course) // Eager load Course
                .Where(q => enrolledCourseIds.Contains(q.CourseId))
                .ToList();

            // For each quiz, determine the student's status and score
            var results = quizzes.Select(q =>
            {
                var submission = _context.QuizSubmissions
                    .FirstOrDefault(s => s.QuizId == q.Id && s.StudentId == studentId);

                string status;
                int? score = null;
                if (submission == null)
                {
                    status = "Not Started";
                }
                else
                {
                    status = "Completed";
                    score = submission.Score;
                }

                return new
                {
                    id = q.Id,
                    course = q.Course != null ? q.Course.Name : "N/A",
                    title = q.Title,
                    status,
                    score
                };
            }).ToList();

            return Ok(results);
        }
    }
}
