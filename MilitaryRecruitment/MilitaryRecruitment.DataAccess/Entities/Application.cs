namespace MilitaryRecruitment.DataAccess.Entities;

public class Application
{
    public Guid Id { get; set; }
    public Guid CandidateId { get; set; }
    public Guid VacancyId { get; set; }
    public double Score { get; set; }
    public bool IsChosenByAlgorythm { get; set; } = false;
    public bool WasFullyCheckedByAlgorythm { get; set; } = false;
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }

    public virtual Candidate Candidate { get; set; } = null!;
    public virtual Vacancy Vacancy { get; set; } = null!;
}