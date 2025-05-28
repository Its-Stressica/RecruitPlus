namespace MilitaryRecruitment.BusinessLogic.Services;

using DTOs.Vacancy;
using MilitaryRecruitment.DataAccess;
using MilitaryRecruitment.DataAccess.Entities;
using MilitaryRecruitment.DataAccess.Repositories;

public class VacancyService
{
    private readonly UnitOfWork _unitOfWork;
    private readonly VacancyRepository _vacancyRepository;

    public VacancyService(UnitOfWork unitOfWork, VacancyRepository vacancyRepository)
    {
        _unitOfWork = unitOfWork;
        _vacancyRepository = vacancyRepository;
    }

    public IEnumerable<VacancyGetDto> GetAllVacancies()
    {
        var vacancies = _vacancyRepository.GetAll();
        return vacancies.Select(v => new VacancyGetDto
        {
            Id = v.Id,
            Title = v.Title,
            Description = v.Description
        });
    }

    public VacancyGetDto GetVacancyById(Guid id)
    {
        var vacancy = _vacancyRepository.GetById(id);
        if (vacancy == null) return null;

        return new VacancyGetDto
        {
            Id = vacancy.Id,
            Title = vacancy.Title,
            Description = vacancy.Description
        };
    }

    public void CreateVacancy(VacancyCreateDto vacancyDto)
    {
        var vacancy = new Vacancy
        {
            Title = vacancyDto.Title,
            Description = vacancyDto.Description,
            Quota = vacancyDto.Quota,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        _vacancyRepository.Add(vacancy);
        _unitOfWork.SaveChanges();
    }



    public void DeleteVacancy(Guid id)
    {
        var vacancy = _vacancyRepository.GetById(id);
        if (vacancy != null)
        {
            _vacancyRepository.Delete(vacancy);
            _unitOfWork.SaveChanges();
        }
    }
}
