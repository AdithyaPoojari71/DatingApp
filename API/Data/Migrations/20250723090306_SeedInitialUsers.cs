using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace API.Data.Migrations
{
    /// <inheritdoc />
    public partial class SeedInitialUsers : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
            table: "Users",
            columns: new[] { "Id", "DisplayName", "Email" },
            values: new object[,]
            {
                { "user-1", "John Doe", "john@example.com" },
                { "user-2", "Jane Smith", "jane@example.com" },
                { "user-3", "Alice Johnson", "alice@example.com" },
                { "user-4", "Bob Brown", "bob@example.com" },
                { "user-5", "Charlie Davis", "charlie@example.com" }
            });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("DELETE FROM Users");
        }
    }
}
