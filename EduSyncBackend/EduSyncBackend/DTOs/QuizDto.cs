namespace EduSyncBackend.DTOs
{
    public class QuizDto
    {
        public string Title { get; set; }
        public string Description { get; set; }
        public DateTime? DueDate { get; set; }
        public int CourseId { get; set; }
    }
}
