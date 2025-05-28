using MilitaryRecruitment.BusinessLogic.DTOs.Application;
using MilitaryRecruitment.DataAccess;
using MilitaryRecruitment.DataAccess.Entities;
using MilitaryRecruitment.DataAccess.Repositories;

namespace MilitaryRecruitment.BusinessLogic.Services;

public class ApplicationService
{
    private readonly UnitOfWork _unitOfWork;
    private readonly ApplicationRepository _applicationRepository;
    private readonly CandidateRepository _candidateRepository;
    private readonly VacancyRepository _vacancyRepository;

    public ApplicationService(
        UnitOfWork unitOfWork,
        ApplicationRepository applicationRepository,
        CandidateRepository candidateRepository,
        VacancyRepository vacancyRepository)
    {
        _unitOfWork = unitOfWork;
        _applicationRepository = applicationRepository;
        _candidateRepository = candidateRepository;
        _vacancyRepository = vacancyRepository;
    }

    public IEnumerable<ApplicationGetDto> GetAllApplications()
    {
        var applications = _applicationRepository.GetAll();
        return applications.Select(a => new ApplicationGetDto
        {
            Id = a.Id,
            CandidateId = a.CandidateId,
            VacancyId = a.VacancyId,
            Score = a.Score,
            IsChosenByAlgorythm = a.IsChosenByAlgorythm,
            CreatedAt = a.CreatedAt,
            UpdatedAt = a.UpdatedAt
        });
    }

    public ApplicationGetDto GetApplicationById(Guid id)
    {
        var application = _applicationRepository.GetById(id);
        if (application == null) return null;

        var candidate = _candidateRepository.GetById(application.CandidateId);
        var vacancy = _vacancyRepository.GetById(application.VacancyId);

        return new ApplicationGetDto
        {
            Id = application.Id,
            CandidateId = application.CandidateId,
            VacancyId = application.VacancyId,
            Score = application.Score,
            IsChosenByAlgorythm = application.IsChosenByAlgorythm,
            CreatedAt = application.CreatedAt,
            UpdatedAt = application.UpdatedAt,
        };
    }

    public ApplicationGetDto CreateApplication(ApplicationCreateDto applicationDto)
    {
        var application = new Application
        {
            CandidateId = applicationDto.CandidateId,
            VacancyId = applicationDto.VacancyId,
            Score = applicationDto.Score,
            IsChosenByAlgorythm = applicationDto.IsChosenByAlgorythm,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        _applicationRepository.Add(application);
        _unitOfWork.SaveChanges();

        // Get the created application with its ID and related entities
        var createdApplication = _applicationRepository.GetById(application.Id);
        var candidate = _candidateRepository.GetById(application.CandidateId);
        var vacancy = _vacancyRepository.GetById(application.VacancyId);

        return new ApplicationGetDto
        {
            Id = createdApplication.Id,
            CandidateId = createdApplication.CandidateId,
            VacancyId = createdApplication.VacancyId,
            Score = createdApplication.Score,
            IsChosenByAlgorythm = createdApplication.IsChosenByAlgorythm,
            CreatedAt = createdApplication.CreatedAt,
            UpdatedAt = createdApplication.UpdatedAt,
        };
    }

    public void DeleteApplication(Guid id)
    {
        var application = _applicationRepository.GetById(id);
        if (application != null)
        {
            _applicationRepository.Delete(application);
            _unitOfWork.SaveChanges();
        }
    }

    public IEnumerable<ApplicationGetDto> GetApplicationsByCandidateId(Guid candidateId)
    {
        var applications = _applicationRepository.GetByCandidateId(candidateId);
        return applications.Select(a => new ApplicationGetDto
        {
            Id = a.Id,
            CandidateId = a.CandidateId,
            VacancyId = a.VacancyId,
            Score = a.Score,
            IsChosenByAlgorythm = a.IsChosenByAlgorythm,
            CreatedAt = a.CreatedAt,
            UpdatedAt = a.UpdatedAt
        });
    }

    public IEnumerable<ApplicationGetDto> GetApplicationsByVacancyId(Guid vacancyId)
    {
        var applications = _applicationRepository.GetByVacancyId(vacancyId);
        return applications.Select(a => new ApplicationGetDto
        {
            Id = a.Id,
            CandidateId = a.CandidateId,
            VacancyId = a.VacancyId,
            Score = a.Score,
            IsChosenByAlgorythm = a.IsChosenByAlgorythm,
            CreatedAt = a.CreatedAt,
            UpdatedAt = a.UpdatedAt
        });
    }

    public IEnumerable<ApplicationGetDto> GetApplicationByCandidateIdAndVacancyId(Guid candidateId, Guid vacancyId)
    {
        var applications = _applicationRepository.GetByCandidateIdAndVacancyId(candidateId, vacancyId);
        return applications.Select(a => new ApplicationGetDto
        {
            Id = a.Id,
            CandidateId = a.CandidateId,
            VacancyId = a.VacancyId,
            Score = a.Score,
            IsChosenByAlgorythm = a.IsChosenByAlgorythm,
            CreatedAt = a.CreatedAt,
            UpdatedAt = a.UpdatedAt
        });
    }
}
