namespace EduSyncBackend.Models
{
    public class CourseMedia
    {
        public int Id { get; set; }
        public int CourseId { get; set; }
        public string FilePath { get; set; }
        public string OriginalFileName { get; set; }
        public Course Course { get; set; }
    }
}
