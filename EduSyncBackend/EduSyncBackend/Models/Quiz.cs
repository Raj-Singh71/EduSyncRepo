using EduSyncBackend.Models;

public class Quiz
{
    public int Id { get; set; }
    public string Title { get; set; }
    public string Description { get; set; }
    public DateTime? DueDate { get; set; }
    public int CourseId { get; set; }
    public Course Course { get; set; }
    public ICollection<QuizQuestions> Questions { get; set; }
}
