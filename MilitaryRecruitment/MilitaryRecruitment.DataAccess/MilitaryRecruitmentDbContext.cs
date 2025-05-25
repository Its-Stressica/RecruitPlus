using Microsoft.EntityFrameworkCore;
using MilitaryRecruitment.DataAccess.Entities;

namespace MilitaryRecruitment.DataAccess;

public class MilitaryRecruitmentDbContext : DbContext
{
    public DbSet<Vacancy> Vacancies { get; set; }
    public DbSet<Candidate> Candidates { get; set; }
    public DbSet<Application> Applications { get; set; }

    public MilitaryRecruitmentDbContext(DbContextOptions<MilitaryRecruitmentDbContext> options) : base(options)
    {

    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
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
    }
}