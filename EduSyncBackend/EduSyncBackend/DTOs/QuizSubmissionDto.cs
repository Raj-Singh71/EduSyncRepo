using EduSyncBackend.DTOs;

public class QuizSubmissionDto
{
    public int StudentId { get; set; }
    public List<QuizAnswerDto> Answers { get; set; }
}