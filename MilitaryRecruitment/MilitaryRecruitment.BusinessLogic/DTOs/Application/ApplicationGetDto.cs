using MilitaryRecruitment.BusinessLogic.DTOs.Candidate;
using MilitaryRecruitment.BusinessLogic.DTOs.Vacancy;

namespace MilitaryRecruitment.BusinessLogic.DTOs.Application;

public class ApplicationGetDto
{
    public Guid Id { get; set; }
    public Guid CandidateId { get; set; }
    public Guid VacancyId { get; set; }
    public double Score { get; set; }
    public bool IsChosenByAlgorythm { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}
