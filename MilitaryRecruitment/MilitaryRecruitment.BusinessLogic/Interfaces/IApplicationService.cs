using MilitaryRecruitment.BusinessLogic.DTOs.Application;

namespace MilitaryRecruitment.BusinessLogic.Interfaces;
public interface IApplicationService
{
    IEnumerable<ApplicationGetDto> GetAllApplicationsAsync();
    ApplicationGetDto GetApplicationByIdAsync(int id);
    ApplicationGetDto CreateApplicationAsync(ApplicationGetDto applicationDto);
    void UpdateApplicationAsync(int id, ApplicationGetDto applicationDto);
    void DeleteApplicationAsync(int id);
    IEnumerable<ApplicationGetDto> GetApplicationsByCandidateAsync(int candidateId);
    IEnumerable<ApplicationGetDto> GetApplicationsByVacancyAsync(int vacancyId);
}
