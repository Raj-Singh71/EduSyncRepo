namespace EduSyncBackend.Models
{
    public class Enrollment
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public int CourseId { get; set; }

        // Navigation properties
        public User User { get; set; }
        public Course Course { get; set; }
    }
}
