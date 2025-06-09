using EduSyncBackend.Models;

public class QuizAnswer
{
    public int Id { get; set; }
    public int QuizSubmissionId { get; set; }
    public QuizSubmission QuizSubmission { get; set; }
    public int QuizQuestionId { get; set; }
    public QuizQuestions QuizQuestion { get; set; }
    public string AnswerText { get; set; }
}
