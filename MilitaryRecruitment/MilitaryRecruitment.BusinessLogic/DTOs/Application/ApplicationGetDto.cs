using MilitaryRecruitment.BusinessLogic.DTOs.Candidate;
using MilitaryRecruitment.BusinessLogic.DTOs.Vacancy;

namespace MilitaryRecruitment.BusinessLogic.DTOs.Application;

public class ApplicationGetDto
{
    public Guid Id { get; set; }
    public Guid CandidateId { get; set; }
    public string CandidateFirstName { get; set; } = string.Empty;
    public string CandidateLastName { get; set; } = string.Empty;
    public Guid VacancyId { get; set; }
    public double Score { get; set; }
    public bool IsChosenByAlgorithm { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}
