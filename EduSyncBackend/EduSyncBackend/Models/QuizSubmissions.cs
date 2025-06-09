using EduSyncBackend.Models;

public class QuizSubmission
{
    public int Id { get; set; }
    public int QuizId { get; set; }
    public Quiz Quiz { get; set; }
    public int StudentId { get; set; }
    public User Student { get; set; }
    public int Score { get; set; }
    public DateTime SubmittedAt { get; set; }
    public ICollection<QuizAnswer> Answers { get; set; }
}
