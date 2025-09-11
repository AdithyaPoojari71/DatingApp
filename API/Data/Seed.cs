using API.DTOs;
using API.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace API.Data
{
    public class Seed
    {
        public static async Task SeedUserd(UserManager<AppUser> userManager)
        {
            if (await userManager.Users.AnyAsync()) return;

            var memberData = await System.IO.File.ReadAllTextAsync("Data/UserSeedData.json");
            var members = System.Text.Json.JsonSerializer.Deserialize<List<SeedUserDto>>(memberData);

            if (members == null) return;

            foreach (var member in members)
            {
                var user = new AppUser
                {
                    Id = member.Id,
                    Email = member.Email,
                    UserName = member.Email,
                    DisplayName = member.DisplayName,
                    ImageUrl = member.ImageUrl,
                    Member = new Member
                    {
                        Id = member.Id,
                        DisplayName = member.DisplayName,
                        Description = member.Description,
                        DateOfBirth = member.DateOfBirth,
                        ImageUrl = member.ImageUrl,
                        Gender = member.Gender,
                        City = member.City,
                        Country = member.Country,
                        LastActive = member.LastActive == default ? DateTime.UtcNow : member.LastActive,
                        Created = member.Created == default ? DateTime.UtcNow : member.Created
                    },
                };

                user.Member.Photos.Add(new Photo
                {
                    Url = member.ImageUrl!,
                    MemberId = member.Id,
                    IsApproved = true
                });

                var result = await userManager.CreateAsync(user, "Pa$$w0rd");
                if (result.Succeeded)
                {
                    await userManager.AddToRoleAsync(user, "Member");
                }
            }

            var admin = new AppUser
            {
                DisplayName = "Admin",
                UserName = "admin",
                Email = "admin@test.com",
            };

            await userManager.CreateAsync(admin, "Pa$$w0rd");
            await userManager.AddToRolesAsync(admin, new[] { "Admin", "Moderator" });
        }
    }
}
