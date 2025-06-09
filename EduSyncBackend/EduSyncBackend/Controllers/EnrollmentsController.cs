using Microsoft.AspNetCore.Mvc;
using EduSyncBackend.Data;
using EduSyncBackend.Models;
using EduSyncBackend.DTOs;
using System.Linq;

namespace EduSyncBackend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EnrollmentsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public EnrollmentsController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpPost]
        public IActionResult Enroll([FromBody] EnrollmentDto dto)
        {
            var exists = _context.Enrollments
                .Any(e => e.UserId == dto.UserId && e.CourseId == dto.CourseId);
            if (exists)
                return BadRequest("You are already enrolled in this course.");

            var enrollment = new Enrollment
            {
                UserId = dto.UserId,
                CourseId = dto.CourseId
            };
            _context.Enrollments.Add(enrollment);
            _context.SaveChanges();
            return Ok(enrollment);
        }

        [HttpGet("user/{userId}")]
        public IActionResult GetEnrolledCourses(int userId)
        {
            var courses = _context.Enrollments
                .Where(e => e.UserId == userId)
                .Select(e => new CourseDto
                {
                    Id = e.Course.Id,
                    Name = e.Course.Name,
                    Description = e.Course.Description,
                    InstructorId = e.Course.InstructorId,
                    MediaFiles = e.Course.MediaFiles.Select(m => new CourseMediaDto
                    {
                        Id = m.Id,
                        FilePath = m.FilePath,
                        OriginalFileName = m.OriginalFileName
                    }).ToList()
                })
                .ToList();

            return Ok(courses);
        }

    }
}
