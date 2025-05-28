using MilitaryRecruitment.BusinessLogic.DTOs.Vacancy;

namespace MilitaryRecruitment.BusinessLogic.Interfaces;
public interface IVacancyService
{
    IEnumerable<VacancyGetDto> GetAllVacanciesAsync();
    VacancyGetDto GetVacancyByIdAsync(int id);
    VacancyGetDto CreateVacancyAsync(VacancyGetDto vacancyDto);
    void UpdateVacancyAsync(int id, VacancyGetDto vacancyDto);
    void DeleteVacancyAsync(int id);
    IEnumerable<VacancyGetDto> GetOpenVacanciesAsync();
    IEnumerable<VacancyGetDto> GetVacanciesByStatusAsync(string status);
}
