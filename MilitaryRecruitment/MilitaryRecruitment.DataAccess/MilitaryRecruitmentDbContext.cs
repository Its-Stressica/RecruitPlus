using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using MilitaryRecruitment.DataAccess.Entities;
using MilitaryRecruitment.DataAccess.Identity;

namespace MilitaryRecruitment.DataAccess;

public class MilitaryRecruitmentDbContext : IdentityDbContext<AppUser>
{
    public DbSet<Vacancy> Vacancies { get; set; }
    public DbSet<Candidate> Candidates { get; set; }
    public DbSet<Application> Applications { get; set; }

    public MilitaryRecruitmentDbContext(DbContextOptions<MilitaryRecruitmentDbContext> options) : base(options)
    {

    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Vacancy>()
            .Property(v => v.Title)
            .IsRequired()
            .HasMaxLength(100);

        modelBuilder.Entity<Candidate>()
            .Property(c => c.FirstName)
            .IsRequired()
            .HasMaxLength(50);

        modelBuilder.Entity<Application>()
            .Property(a => a.Score)
            .IsRequired();

        modelBuilder.Entity<AppUser>(entity =>
        {
            entity.HasIndex(e => e.Name).IsUnique();
            entity.HasKey(e => e.Name);
        });

        modelBuilder.Entity<Microsoft.AspNetCore.Identity.IdentityUserLogin<string>>(entity =>
        {
            entity.HasKey(e => new { e.LoginProvider, e.ProviderKey });
        });

        modelBuilder.Entity<Microsoft.AspNetCore.Identity.IdentityUserRole<string>>(entity =>
        {
            entity.HasKey(e => new { e.UserId, e.RoleId });
        });

        modelBuilder.Entity<Microsoft.AspNetCore.Identity.IdentityUserToken<string>>(entity =>
        {
            entity.HasKey(e => new { e.UserId, e.LoginProvider, e.Name });
        });
    }
}