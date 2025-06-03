using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MilitaryRecruitment.DataAccess.Migrations
{
    /// <inheritdoc />
    public partial class RenameAlgorithmColumns : Migration
    {
protected override void Up(MigrationBuilder migrationBuilder)
{
    migrationBuilder.RenameColumn(
        name: "IsChosenByAlgorythm",
        table: "Applications",
        newName: "IsChosenByAlgorithm");

    // Add this if you also need to rename the other column
    migrationBuilder.RenameColumn(
        name: "WasFullyCheckedByAlgorythm",
        table: "Applications",
        newName: "WasFullyCheckedByAlgorithm");
}

protected override void Down(MigrationBuilder migrationBuilder)
{
    migrationBuilder.RenameColumn(
        name: "IsChosenByAlgorithm",
        table: "Applications",
        newName: "IsChosenByAlgorythm");

    migrationBuilder.RenameColumn(
        name: "WasFullyCheckedByAlgorithm",
        table: "Applications",
        newName: "WasFullyCheckedByAlgorythm");
}
    }
}
