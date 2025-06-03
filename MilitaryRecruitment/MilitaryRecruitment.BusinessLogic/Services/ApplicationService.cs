using Microsoft.Extensions.Logging;
using MilitaryRecruitment.BusinessLogic.DTOs.Application;
using MilitaryRecruitment.DataAccess;
using MilitaryRecruitment.DataAccess.Entities;
using MilitaryRecruitment.DataAccess.Repositories;
using System.Diagnostics;

namespace MilitaryRecruitment.BusinessLogic.Services;

public class ApplicationService
{
    private readonly UnitOfWork _unitOfWork;
    private readonly ApplicationRepository _applicationRepository;
    private readonly CandidateRepository _candidateRepository;
    private readonly VacancyRepository _vacancyRepository;

    private readonly ILogger<ApplicationService> _logger;

    public ApplicationService(
        UnitOfWork unitOfWork,
        ApplicationRepository applicationRepository,
        CandidateRepository candidateRepository,
        VacancyRepository vacancyRepository,
        ILogger<ApplicationService> logger)
    {
        _unitOfWork = unitOfWork;
        _applicationRepository = applicationRepository;
        _candidateRepository = candidateRepository;
        _vacancyRepository = vacancyRepository;
        _logger = logger;
    }

    public void ResetAllAssignments()
    {
        var applications = _applicationRepository.GetAll().ToList();
        foreach (var app in applications)
        {
            app.IsChosenByAlgorithm = false;
            app.WasFullyCheckedByAlgorithm = false;
            _applicationRepository.Update(app);
        }
        _unitOfWork.SaveChanges();
    }

    public IEnumerable<ApplicationGetDto> GetAllApplications()
    {
        var applications = _applicationRepository.GetAll();
        return applications.Select(a => 
        {
            var candidate = _candidateRepository.GetById(a.CandidateId);
            return new ApplicationGetDto
            {
                Id = a.Id,
                CandidateId = a.CandidateId,
                CandidateFirstName = candidate?.FirstName ?? string.Empty,
                CandidateLastName = candidate?.LastName ?? string.Empty,
                VacancyId = a.VacancyId,
                Score = a.Score,
                IsChosenByAlgorithm = a.IsChosenByAlgorithm,
                CreatedAt = a.CreatedAt,
                UpdatedAt = a.UpdatedAt
            };
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
            CandidateFirstName = candidate?.FirstName ?? string.Empty,
            CandidateLastName = candidate?.LastName ?? string.Empty,
            VacancyId = application.VacancyId,
            Score = application.Score,
            IsChosenByAlgorithm = application.IsChosenByAlgorithm,
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
            IsChosenByAlgorithm = applicationDto.IsChosenByAlgorithm,
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
            CandidateFirstName = candidate?.FirstName ?? string.Empty,
            CandidateLastName = candidate?.LastName ?? string.Empty,
            VacancyId = createdApplication.VacancyId,
            Score = createdApplication.Score,
            IsChosenByAlgorithm = createdApplication.IsChosenByAlgorithm,
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

    private Dictionary<Guid, List<Application>> AssignInitialCandidates()
    {
        var assignments = new Dictionary<Guid, List<Application>>();
        var vacancies = _vacancyRepository.GetAll().ToList();
        var applications = _applicationRepository.GetAll().ToList();
        var candidates = _candidateRepository.GetAll().ToList();

        foreach (var vacancy in vacancies)
        {
            assignments[vacancy.Id] = new List<Application>();
        }

        foreach (var candidate in candidates)
        {
            var candidateApps = applications
                .Where(a => a.CandidateId == candidate.Id)
                .ToList();

            if (!candidateApps.Any())continue;

            var maxScore = candidateApps.Max(a => a.Score);
            var bestApps = candidateApps.Where(a => a.Score == maxScore).ToList();

            Application bestApp;
            if (bestApps.Count == 1)
            {
                bestApp = bestApps.Single();
            }
            else
            {
                bestApp = bestApps
                    .OrderByDescending(a => 
                        vacancies.First(v => v.Id == a.VacancyId).Priority)
                    .First();
            }

            assignments[bestApp.VacancyId].Add(bestApp);
            bestApp.IsChosenByAlgorithm = true;
            _applicationRepository.Update(bestApp);
            _unitOfWork.SaveChanges();
        }

        _unitOfWork.SaveChanges();
        return assignments;
    }

    private List<Vacancy> FindOverquotaVacancies(Dictionary<Guid, List<Application>> assignments)
    {
        var vacancies = _vacancyRepository.GetAll().ToList();
        var overquota = new List<Vacancy>();

        foreach (var vacancy in vacancies)
        {
            var assigned = assignments[vacancy.Id];
            if (assigned.Count > vacancy.Quota)
            {
                overquota.Add(vacancy);
            }
        }

        return overquota;
    }

    private (Guid, double) FindBestReplacementForCandidate(Application candidateApp, List<Application> applications)
    {
        var currentVacancyId = candidateApp.VacancyId;
        var candidateApps = applications
            .Where(a => a.CandidateId == candidateApp.CandidateId && 
                         a.VacancyId != currentVacancyId && 
                         a.WasFullyCheckedByAlgorithm == false)
            .ToList();

        if (!candidateApps.Any())
        {
            return (Guid.Empty, 0);
        }

        var bestApp = candidateApps
            .OrderByDescending(a => a.Score)
            .First();

        return (bestApp.VacancyId, bestApp.Score);
    }

    private bool ReplaceCandidate(Dictionary<Guid, List<Application>> assignments, List<Application> applications, Vacancy vacancyToFix)
    {
        var applicationsOfCandidatesToReplace = assignments[vacancyToFix.Id];
        var scoresDiff = new List<double>();
        var replacementOptions = new List<(Application, Guid, double)>();

        foreach (var app in applicationsOfCandidatesToReplace)
        {
            var (replacementVacancyId, replacementScore) = FindBestReplacementForCandidate(app, applications);
            var originalScore = app.Score;
            var diff = replacementScore != 0 ? originalScore - replacementScore : double.MaxValue;
            scoresDiff.Add(diff);
            replacementOptions.Add((app, replacementVacancyId, replacementScore));
            // replacementOptions.Add((app, replacementVacancyId, diff));
        }

        if (replacementOptions.All(r => r.Item3 == 0))
        {
            // Remove the worst candidate if no better replacements are possible
            var worstApp = applicationsOfCandidatesToReplace
                .OrderBy(a => a.Score)
                .First();

            assignments[vacancyToFix.Id].Remove(worstApp);
            worstApp.IsChosenByAlgorithm = false;
            _applicationRepository.Update(worstApp);
            _unitOfWork.SaveChanges();
            return false;
        }

        // Find replacement with minimum score difference
        var minDiffIndex = scoresDiff.IndexOf(scoresDiff.Min());
        var (appToReplace, replacementVac, _) = replacementOptions[minDiffIndex];

        // Remove candidate from original vacancy
        assignments[vacancyToFix.Id].Remove(appToReplace);
        appToReplace.IsChosenByAlgorithm = false;
        appToReplace.WasFullyCheckedByAlgorithm = true;
        _applicationRepository.Update(appToReplace);
        _unitOfWork.SaveChanges();

        // If there's a better replacement, add to new vacancy
        if (replacementVac != Guid.Empty)
        {
            var newAssignmentApp = applications
                .First(a => a.CandidateId == appToReplace.CandidateId && 
                           a.VacancyId == replacementVac);

            assignments[replacementVac].Add(newAssignmentApp);
            newAssignmentApp.IsChosenByAlgorithm = true;
            _applicationRepository.Update(newAssignmentApp);
            _unitOfWork.SaveChanges();
        }

        _unitOfWork.SaveChanges();
        return true;
    }

    public IEnumerable<AlgorithmResultDto> RunMakAlgorithm()
    {
        var assignments = AssignInitialCandidates();
        int step = 1;

        while (true)
        {
            var overquotaVacancies = FindOverquotaVacancies(assignments);
            if (!overquotaVacancies.Any()) break;

            foreach (var vacancy in overquotaVacancies)
            {
                Debug.WriteLine($"Step {step}: Vacancy '{vacancy.Title}' exceeds quote ({(assignments[vacancy.Id].Count())} > {vacancy.Quota})");
                var canContinue = ReplaceCandidate(assignments, _applicationRepository.GetAll().ToList(), vacancy);
                if (!canContinue)
                {
                    Debug.WriteLine("No better chances available. Optimization stopped");
                    break;
                }
                step++;
            }
        }

        // Convert to DTO with names
        var results = new List<AlgorithmResultDto>();
        foreach (var vacancyId in assignments.Keys)
        {
            var vacancy = _vacancyRepository.GetById(vacancyId);
            foreach (var application in assignments[vacancyId])
            {
                var candidate = _candidateRepository.GetById(application.CandidateId);
                results.Add(new AlgorithmResultDto
                {
                    Id = application.Id,
                    CandidateName = $"{candidate.FirstName} {candidate.LastName}",
                    VacancyTitle = vacancy.Title,
                    Score = application.Score,
                    IsChosenByAlgorithm = application.IsChosenByAlgorithm
                });
            }
        }

        return results;
    }

    public IEnumerable<ApplicationGetDto> GetApplicationsByCandidateId(Guid candidateId)
    {
        var applications = _applicationRepository.GetByCandidateId(candidateId);
        var candidate = _candidateRepository.GetById(candidateId);
        return applications.Select(a => new ApplicationGetDto
        {
            Id = a.Id,
            CandidateId = a.CandidateId,
            CandidateFirstName = candidate?.FirstName ?? string.Empty,
            CandidateLastName = candidate?.LastName ?? string.Empty,
            VacancyId = a.VacancyId,
            Score = a.Score,
            IsChosenByAlgorithm = a.IsChosenByAlgorithm,
            CreatedAt = a.CreatedAt,
            UpdatedAt = a.UpdatedAt
        });
    }

    public IEnumerable<ApplicationGetDto> GetApplicationsByVacancyId(Guid vacancyId)
    {
        var applications = _applicationRepository.GetByVacancyId(vacancyId);
        return applications.Select(a => 
        {
            var candidate = _candidateRepository.GetById(a.CandidateId);
            return new ApplicationGetDto
            {
                Id = a.Id,
                CandidateId = a.CandidateId,
                CandidateFirstName = candidate?.FirstName ?? string.Empty,
                CandidateLastName = candidate?.LastName ?? string.Empty,
                VacancyId = a.VacancyId,
                Score = a.Score,
                IsChosenByAlgorithm = a.IsChosenByAlgorithm,
                CreatedAt = a.CreatedAt,
                UpdatedAt = a.UpdatedAt
            };
        });
    }

    public IEnumerable<ApplicationGetDto> GetApplicationByCandidateIdAndVacancyId(Guid candidateId, Guid vacancyId)
    {
        var applications = _applicationRepository.GetByCandidateIdAndVacancyId(candidateId, vacancyId);
        var candidate = _candidateRepository.GetById(candidateId);
        return applications.Select(a => new ApplicationGetDto
        {
            Id = a.Id,
            CandidateId = a.CandidateId,
            CandidateFirstName = candidate?.FirstName ?? string.Empty,
            CandidateLastName = candidate?.LastName ?? string.Empty,
            VacancyId = a.VacancyId,
            Score = a.Score,
            IsChosenByAlgorithm = a.IsChosenByAlgorithm,
            CreatedAt = a.CreatedAt,
            UpdatedAt = a.UpdatedAt
        });
    }
}
