using API.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using System.Security.Cryptography.X509Certificates;

namespace API.Data
{
    public class AppDbContext(DbContextOptions options) : DbContext(options)
    {
        public DbSet<AppUser> Users { get; set; }
        public DbSet<Member> Members { get; set; }
        public DbSet<Photo> Photos { get; set; }
        public DbSet<MemberLike> Likes { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configure the these two columns together are the unique identifier (primary key) for this table.”
            modelBuilder.Entity<MemberLike>()
                .HasKey(x => new { x.SourceMemberId, x.TargetMemberId });

            modelBuilder.Entity<MemberLike>()
                .HasOne(x => x.SourceMember)
                .WithMany(t => t.LikedMembers)
                .HasForeignKey(s => s.SourceMemberId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<MemberLike>()
               .HasOne(x => x.TargetMember)
               .WithMany(t => t.LikedByMembers)
               .HasForeignKey(s => s.TargetMemberId)
               .OnDelete(DeleteBehavior.NoAction);

            //method to convert to utc bec in db datetime not stored in utc
            var dateTimeConverter = new ValueConverter<DateTime, DateTime>(
                v => v.ToUniversalTime(),
                v => DateTime.SpecifyKind(v, DateTimeKind.Utc)
            );

            foreach (var entityType in modelBuilder.Model.GetEntityTypes())
            {
                foreach (var property in entityType.GetProperties())
                {
                    if (property.ClrType == typeof(DateTime))
                    {
                        property.SetValueConverter(dateTimeConverter);
                    }
                }
            }
        }


    }
}
