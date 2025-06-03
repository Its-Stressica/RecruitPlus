namespace MilitaryRecruitment.DataAccess.Entities;

public class Application
{
    public Guid Id { get; set; }
    public Guid CandidateId { get; set; }
    public Guid VacancyId { get; set; }
    public double Score { get; set; }
    public bool IsChosenByAlgorithm { get; set; } = false;
    public bool WasFullyCheckedByAlgorithm { get; set; } = false;
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }

    public virtual Candidate Candidate { get; set; } = null!;
    public virtual Vacancy Vacancy { get; set; } = null!;
}