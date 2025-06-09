using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace EduSyncBackend.Migrations
{
    /// <inheritdoc />
    public partial class AddCascadeDeleteForCourseMedia : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateIndex(
                name: "IX_CourseMedia_CourseId",
                table: "CourseMedia",
                column: "CourseId");

            migrationBuilder.AddForeignKey(
                name: "FK_CourseMedia_Courses_CourseId",
                table: "CourseMedia",
                column: "CourseId",
                principalTable: "Courses",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_CourseMedia_Courses_CourseId",
                table: "CourseMedia");

            migrationBuilder.DropIndex(
                name: "IX_CourseMedia_CourseId",
                table: "CourseMedia");
        }
    }
}
