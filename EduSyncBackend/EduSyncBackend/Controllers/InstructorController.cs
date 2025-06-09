using Microsoft.AspNetCore.Mvc;
using EduSyncBackend.Data;
using System.Linq;

namespace EduSyncBackend.Controllers
{
    [ApiController]
    [Route("api/instructors")]
    public class InstructorsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public InstructorsController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet("{instructorId}/students-overview")]
        public IActionResult GetStudentsOverview(int instructorId)
        {
            var instructorCourseIds = _context.Courses
                .Where(c => c.InstructorId == instructorId)
                .Select(c => c.Id)
                .ToList();

            var enrolled = _context.Enrollments
                .Where(e => instructorCourseIds.Contains(e.CourseId))
                .Select(e => new
                {
                    id = e.User.Id,
                    name = e.User.Name,
                    email = e.User.Email,
                    course = e.Course.Name,
                    // if you have this field
                })
                .ToList();

            var enrolledStudentIds = enrolled.Select(s => s.id).Distinct().ToList();
            var notEnrolled = _context.Users
                .Where(u => u.Role == "Student" && !enrolledStudentIds.Contains(u.Id))
                .Select(u => new
                {
                    id = u.Id,
                    name = u.Name,
                    email = u.Email
                })
                .ToList();

            return Ok(new { enrolled, notEnrolled });
        }
    }
}
