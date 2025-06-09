using Microsoft.AspNetCore.Http;
using System.Collections.Generic;

namespace EduSyncBackend.DTOs
{
    public class CourseUploadDto
    {
        public string Name { get; set; }
        public string Description { get; set; }
        public List<IFormFile>? Media { get; set; }
        public int InstructorId { get; set; }
    }
}
