using Microsoft.EntityFrameworkCore.Migrations;

namespace SourcingApi.Data.Migrations
{
    public partial class AddValuesToUser : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Name",
                table: "Users",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "X",
                table: "Users",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "Y",
                table: "Users",
                nullable: false,
                defaultValue: 0);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Name",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "X",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "Y",
                table: "Users");
        }
    }
}
