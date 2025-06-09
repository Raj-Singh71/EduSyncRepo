using Microsoft.EntityFrameworkCore;
using EduSyncBackend.Models;

namespace EduSyncBackend.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions options) : base(options) { }

        public DbSet<User> Users { get; set; }
        public DbSet<Course> Courses { get; set; }
        public DbSet<Enrollment> Enrollments { get; set; }
        public DbSet<CourseMedia> CourseMedia { get; set; }
        public DbSet<Quiz> Quizzes { get; set; }
        public DbSet<QuizQuestions> QuizQuestions { get; set; }
        public DbSet<QuizSubmission> QuizSubmissions { get; set; }


        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Configure QuizAnswer relationships
            modelBuilder.Entity<QuizAnswer>()
                .HasOne(qa => qa.QuizSubmission)
                .WithMany(qs => qs.Answers)
                .HasForeignKey(qa => qa.QuizSubmissionId)
                .OnDelete(DeleteBehavior.Cascade); // Cascade on submission delete

            modelBuilder.Entity<QuizAnswer>()
                .HasOne(qa => qa.QuizQuestion)
                .WithMany()
                .HasForeignKey(qa => qa.QuizQuestionId)
                .OnDelete(DeleteBehavior.Restrict); // Prevent cascade on question delete
        }

    }
}
