using System.Collections.Generic;

namespace EduSyncBackend.DTOs
{
    public class CourseDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public int InstructorId { get; set; }
        public List<CourseMediaDto> MediaFiles { get; set; }
    }
}
