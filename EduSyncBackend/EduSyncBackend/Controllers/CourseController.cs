using Microsoft.AspNetCore.Mvc;
using EduSyncBackend.Models;
using EduSyncBackend.Data;
using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using EduSyncBackend.DTOs;
using System.Linq;
using System;
using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;
using EduSyncBackend.Services;

namespace EduSyncBackend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CoursesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly AzureBlobService _blobService;

        public CoursesController(ApplicationDbContext context, AzureBlobService blobService)
        {
            _context = context;
            _blobService = blobService;
        }

        [HttpPost]
        public async Task<IActionResult> CreateCourse([FromForm] CourseUploadDto dto)
        {
            try
            {
                var course = new Course
                {
                    Name = dto.Name,
                    Description = dto.Description,
                    InstructorId = dto.InstructorId
                };
                _context.Courses.Add(course);
                await _context.SaveChangesAsync();

                // Handle multiple file uploads
                if (dto.Media != null && dto.Media.Count > 0)
                {
                    var uploadsDir = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "coursemedia");
                    if (!Directory.Exists(uploadsDir))
                        Directory.CreateDirectory(uploadsDir);

                    foreach (var file in dto.Media)
                    {
                        // 1. Save locally as before
                        var fileName = $"{course.Id}_{Guid.NewGuid()}_{file.FileName}";
                        var filePath = Path.Combine(uploadsDir, fileName);
                        using (var stream = new FileStream(filePath, FileMode.Create))
                        {
                            await file.CopyToAsync(stream);
                        }

                        var localMedia = new CourseMedia
                        {
                            CourseId = course.Id,
                            FilePath = $"/coursemedia/{fileName}",
                            OriginalFileName = file.FileName
                        };
                        _context.CourseMedia.Add(localMedia);

                        // 2. Upload to Azure Blob Storage
                        var azureUrl = await _blobService.UploadFileAsync(file);

                        var azureMedia = new CourseMedia
                        {
                            CourseId = course.Id,
                            FilePath = azureUrl, // Azure Blob URL
                            OriginalFileName = file.FileName
                        };
                        _context.CourseMedia.Add(azureMedia);
                    }
                    await _context.SaveChangesAsync();
                }

                // Project to DTO before returning to avoid cycles
                var courseDto = _context.Courses
                    .Where(c => c.Id == course.Id)
                    .Select(c => new CourseDto
                    {
                        Id = c.Id,
                        Name = c.Name,
                        Description = c.Description,
                        InstructorId = c.InstructorId,
                        MediaFiles = c.MediaFiles
                            .Where(m => m.FilePath.StartsWith("https://"))
                            .Select(m => new CourseMediaDto
                            {
                                Id = m.Id,
                                FilePath = m.FilePath,
                                OriginalFileName = m.OriginalFileName
                            }).ToList()
                    })
                    .FirstOrDefault();

                return Ok(courseDto);
            }
            catch (Exception ex)
            {
                // Log the exception if you have a logger
                // _logger.LogError(ex, "Error in CreateCourse");
                return StatusCode(500, new { error = ex.Message, details = ex.ToString() });
            }
        }

        [HttpGet]
        public IActionResult GetCourses()
        {
            try
            {
                var courses = _context.Courses
                    .Select(c => new CourseDto
                    {
                        Id = c.Id,
                        Name = c.Name,
                        Description = c.Description,
                        InstructorId = c.InstructorId,
                        MediaFiles = c.MediaFiles
                            .Where(m => m.FilePath.StartsWith("https://"))
                            .Select(m => new CourseMediaDto
                            {
                                Id = m.Id,
                                FilePath = m.FilePath,
                                OriginalFileName = m.OriginalFileName
                            }).ToList()
                    })
                    .ToList();

                return Ok(courses);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message, details = ex.ToString() });
            }
        }

        [HttpGet("instructor/{instructorId}")]
        public IActionResult GetInstructorCourses(int instructorId)
        {
            try
            {
                var courses = _context.Courses
                    .Where(c => c.InstructorId == instructorId)
                    .Select(c => new CourseDto
                    {
                        Id = c.Id,
                        Name = c.Name,
                        Description = c.Description,
                        InstructorId = c.InstructorId,
                        MediaFiles = c.MediaFiles
                            .Where(m => m.FilePath.StartsWith("https://"))
                            .Select(m => new CourseMediaDto
                            {
                                Id = m.Id,
                                FilePath = m.FilePath,
                                OriginalFileName = m.OriginalFileName
                            }).ToList()
                    })
                    .ToList();

                return Ok(courses);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message, details = ex.ToString() });
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> EditCourse(int id, [FromForm] CourseUploadDto dto)
        {
            try
            {
                var course = _context.Courses.Find(id);
                if (course == null) return NotFound();

                course.Name = dto.Name;
                course.Description = dto.Description;
                // Optionally update InstructorId, etc.

                // Handle media file upload if any
                if (dto.Media != null && dto.Media.Count > 0)
                {
                    var uploadsDir = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "coursemedia");
                    if (!Directory.Exists(uploadsDir))
                        Directory.CreateDirectory(uploadsDir);

                    foreach (var file in dto.Media)
                    {
                        // 1. Save locally as before
                        var fileName = $"{course.Id}_{Guid.NewGuid()}_{file.FileName}";
                        var filePath = Path.Combine(uploadsDir, fileName);
                        using (var stream = new FileStream(filePath, FileMode.Create))
                        {
                            await file.CopyToAsync(stream);
                        }

                        var localMedia = new CourseMedia
                        {
                            CourseId = course.Id,
                            FilePath = $"/coursemedia/{fileName}",
                            OriginalFileName = file.FileName
                        };
                        _context.CourseMedia.Add(localMedia);

                        // 2. Upload to Azure Blob Storage
                        var azureUrl = await _blobService.UploadFileAsync(file);

                        var azureMedia = new CourseMedia
                        {
                            CourseId = course.Id,
                            FilePath = azureUrl, // Azure Blob URL
                            OriginalFileName = file.FileName
                        };
                        _context.CourseMedia.Add(azureMedia);
                    }
                }

                await _context.SaveChangesAsync();
                return Ok();
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message, details = ex.ToString() });
            }
        }

        [HttpDelete("{id}")]
        public IActionResult DeleteCourse(int id)
        {
            try
            {
                var course = _context.Courses.Find(id);
                if (course == null) return NotFound();

                _context.Courses.Remove(course);
                _context.SaveChanges();
                return Ok();
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message, details = ex.ToString() });
            }
        }
    }
}
