namespace EduSyncBackend.Models
{
    public class Course
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string? MediaPath { get; set; }
        public int InstructorId { get; set; }
        public ICollection<CourseMedia> MediaFiles { get; set; }
    }
}
