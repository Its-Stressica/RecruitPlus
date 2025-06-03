using MilitaryRecruitment.BusinessLogic.DTOs.Candidate;
using MilitaryRecruitment.BusinessLogic.DTOs.Vacancy;

namespace MilitaryRecruitment.BusinessLogic.DTOs.Application;

public class ApplicationCreateDto
{
    public Guid CandidateId { get; set; }
    public Guid VacancyId { get; set; }
    public double Score { get; set; }
    public bool IsChosenByAlgorithm { get; set; }
}
