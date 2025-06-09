namespace EduSyncBackend.Models;
public class QuizQuestions
{
    public int Id { get; set; }
    public int QuizId { get; set; }
    public Quiz Quiz { get; set; }
    public string QuestionText { get; set; }
    public string QuestionType { get; set; } // "MCQ" or "ShortAnswer"
    public string OptionsJson { get; set; } // JSON array for MCQ options
    public string CorrectAnswer { get; set; } // For MCQ
}
