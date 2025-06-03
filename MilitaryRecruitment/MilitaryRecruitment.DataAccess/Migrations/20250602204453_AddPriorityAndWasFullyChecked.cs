using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MilitaryRecruitment.DataAccess.Migrations
{
    /// <inheritdoc />
    public partial class AddPriorityAndWasFullyChecked : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "Priority",
                table: "Vacancies",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<bool>(
                name: "WasFullyCheckedByAlgorithm",
                table: "Applications",
                type: "bit",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Priority",
                table: "Vacancies");

            migrationBuilder.DropColumn(
                name: "WasFullyCheckedByAlgorithm",
                table: "Applications");
        }
    }
}
