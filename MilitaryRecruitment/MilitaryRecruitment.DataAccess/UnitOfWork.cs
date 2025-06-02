using Bogus;
using Bogus.Distributions.Gaussian;
using MilitaryRecruitment.DataAccess.Entities;
using MilitaryRecruitment.DataAccess.Repositories;

namespace MilitaryRecruitment.DataAccess;

public class UnitOfWork
{
    private readonly MilitaryRecruitmentDbContext _context;

    public UnitOfWork(MilitaryRecruitmentDbContext context)
    {
        _context = context;
        Candidates = new CandidateRepository(_context);
        Vacancies = new VacancyRepository(_context);
        Applications = new ApplicationRepository(_context);
    }

    public CandidateRepository Candidates { get; }
    public VacancyRepository Vacancies { get; }
    public ApplicationRepository Applications { get; }

    public void SaveChanges()
    {
        _context.SaveChanges();
    }

    public void GenerateData(bool predefined = true)
    {
        ClearData();

        if (predefined)
        {
            var candidates = new List<Candidate>
            {
                new Candidate { Id = Guid.NewGuid(), FirstName = "Alice", LastName = "Smith" },
                new Candidate { Id = Guid.NewGuid(), FirstName = "Bob", LastName = "Johnson" },
                new Candidate { Id = Guid.NewGuid(), FirstName = "Charlie", LastName = "Brown" },
                new Candidate { Id = Guid.NewGuid(), FirstName = "Diana", LastName = "Wilson" },
                new Candidate { Id = Guid.NewGuid(), FirstName = "Eve", LastName = "Taylor" }
            };

            var vacancies = new List<Vacancy>
            {
                new Vacancy
                {
                    Id = Guid.NewGuid(),
                    Title = "Developer",
                    Description = "Software Developer Position",
                    Priority = 3,
                    Quota = 2,
                    CreatedAt = DateTime.Now,
                    UpdatedAt = DateTime.Now
                },
                new Vacancy
                {
                    Id = Guid.NewGuid(),
                    Title = "Tester",
                    Description = "Software Tester Position",
                    Priority = 2,
                    Quota = 2,
                    CreatedAt = DateTime.Now,
                    UpdatedAt = DateTime.Now
                },
                new Vacancy
                {
                    Id = Guid.NewGuid(),
                    Title = "Designer",
                    Description = "UI/UX Designer Position",
                    Priority = 1,
                    Quota = 1,
                    CreatedAt = DateTime.Now,
                    UpdatedAt = DateTime.Now
                }
            };

            var applications = new List<Application>
            {
                new Application
                {
                    Id = Guid.NewGuid(),
                    CandidateId = candidates.First(c => c.FirstName == "Alice" && c.LastName == "Smith").Id,
                    VacancyId = vacancies.First(v => v.Title == "Developer").Id,
                    Score = 91,
                    CreatedAt = DateTime.Now,
                    UpdatedAt = DateTime.Now
                },
                new Application
                {
                    Id = Guid.NewGuid(),
                    CandidateId = candidates.First(c => c.FirstName == "Bob" && c.LastName == "Johnson").Id,
                    VacancyId = vacancies.First(v => v.Title == "Developer").Id,
                    Score = 92,
                    CreatedAt = DateTime.Now,
                    UpdatedAt = DateTime.Now
                },
                 new Application
                {
                    Id = Guid.NewGuid(),
                    CandidateId = candidates.First(c => c.FirstName == "Charlie" && c.LastName == "Brown").Id,
                    VacancyId = vacancies.First(v => v.Title == "Developer").Id,
                    Score = 93,
                    IsChosenByAlgorythm = false,
                    CreatedAt = DateTime.Now,
                    UpdatedAt = DateTime.Now
                },
                new Application
                {
                    Id = Guid.NewGuid(),
                    CandidateId = candidates.First(c => c.FirstName == "Diana" && c.LastName == "Wilson").Id,
                    VacancyId = vacancies.First(v => v.Title == "Developer").Id,
                    Score = 94,
                    IsChosenByAlgorythm = false,
                    CreatedAt = DateTime.Now,
                    UpdatedAt = DateTime.Now
                },
                new Application
                {
                    Id = Guid.NewGuid(),
                    CandidateId = candidates.First(c => c.FirstName == "Eve" && c.LastName == "Taylor").Id,
                    VacancyId = vacancies.First(v => v.Title == "Developer").Id,
                    Score = 95,
                    IsChosenByAlgorythm = false,
                    CreatedAt = DateTime.Now,
                    UpdatedAt = DateTime.Now
                },
                new Application
                {
                    Id = Guid.NewGuid(),
                    CandidateId = candidates.First(c => c.FirstName == "Alice" && c.LastName == "Smith").Id,
                    VacancyId = vacancies.First(v => v.Title == "Tester").Id,
                    Score = 81,
                    IsChosenByAlgorythm = false,
                    CreatedAt = DateTime.Now,
                    UpdatedAt = DateTime.Now
                },
                new Application
                {
                    Id = Guid.NewGuid(),
                    CandidateId = candidates.First(c => c.FirstName == "Bob" && c.LastName == "Johnson").Id,
                    VacancyId = vacancies.First(v => v.Title == "Tester").Id,
                    Score = 82,
                    IsChosenByAlgorythm = false,
                    CreatedAt = DateTime.Now,
                    UpdatedAt = DateTime.Now
                },
                new Application
                {
                    Id = Guid.NewGuid(),
                    CandidateId = candidates.First(c => c.FirstName == "Charlie" && c.LastName == "Brown").Id,
                    VacancyId = vacancies.First(v => v.Title == "Tester").Id,
                    Score = 73,
                    IsChosenByAlgorythm = false,
                    CreatedAt = DateTime.Now,
                    UpdatedAt = DateTime.Now
                },
                new Application
                {
                    Id = Guid.NewGuid(),
                    CandidateId = candidates.First(c => c.FirstName == "Diana" && c.LastName == "Wilson").Id,
                    VacancyId = vacancies.First(v => v.Title == "Tester").Id,
                    Score = 84,
                    IsChosenByAlgorythm = false,
                    CreatedAt = DateTime.Now,
                    UpdatedAt = DateTime.Now
                },
                new Application
                {
                    Id = Guid.NewGuid(),
                    CandidateId = candidates.First(c => c.FirstName == "Eve" && c.LastName == "Taylor").Id,
                    VacancyId = vacancies.First(v => v.Title == "Tester").Id,
                    Score = 85,
                    IsChosenByAlgorythm = false,
                    CreatedAt = DateTime.Now,
                    UpdatedAt = DateTime.Now
                },
                new Application
                {
                    Id = Guid.NewGuid(),
                    CandidateId = candidates.First(c => c.FirstName == "Alice" && c.LastName == "Smith").Id,
                    VacancyId = vacancies.First(v => v.Title == "Designer").Id,
                    Score = 71,
                    IsChosenByAlgorythm = false,
                    CreatedAt = DateTime.Now,
                    UpdatedAt = DateTime.Now
                },
                new Application
                {
                    Id = Guid.NewGuid(),
                    CandidateId = candidates.First(c => c.FirstName == "Bob" && c.LastName == "Johnson").Id,
                    VacancyId = vacancies.First(v => v.Title == "Designer").Id,
                    Score = 72,
                    IsChosenByAlgorythm = false,
                    CreatedAt = DateTime.Now,
                    UpdatedAt = DateTime.Now
                },
                new Application
                {
                    Id = Guid.NewGuid(),
                    CandidateId = candidates.First(c => c.FirstName == "Charlie" && c.LastName == "Brown").Id,
                    VacancyId = vacancies.First(v => v.Title == "Designer").Id,
                    Score = 73,
                    IsChosenByAlgorythm = false,
                    CreatedAt = DateTime.Now,
                    UpdatedAt = DateTime.Now
                },
                new Application
                {
                    Id = Guid.NewGuid(),
                    CandidateId = candidates.First(c => c.FirstName == "Diana" && c.LastName == "Wilson").Id,
                    VacancyId = vacancies.First(v => v.Title == "Designer").Id,
                    Score = 74,
                    IsChosenByAlgorythm = false,
                    CreatedAt = DateTime.Now,
                    UpdatedAt = DateTime.Now
                },
                new Application
                {
                    Id = Guid.NewGuid(),
                    CandidateId = candidates.First(c => c.FirstName == "Eve" && c.LastName == "Taylor").Id,
                    VacancyId = vacancies.First(v => v.Title == "Designer").Id,
                    Score = 75,
                    IsChosenByAlgorythm = false,
                    CreatedAt = DateTime.Now,
                    UpdatedAt = DateTime.Now
                }
            };

            foreach (var candidate in candidates)
            {
                Candidates.Add(candidate);
            }

            foreach (var vacancy in vacancies)
            {
                Vacancies.Add(vacancy);
            }

            foreach (var application in applications)
            {
                Applications.Add(application);
            }
        }
        else
        {
            var random = new Random();
            var numberOfCandidates = random.Next(3, 10);
            var numberOfVacancies = random.Next(numberOfCandidates, 2 * numberOfCandidates);

            GenerateApplications(GenerateCandidates(numberOfCandidates), GenerateVacancies(numberOfVacancies));
        }

        SaveChanges();
    }

    public void ClearData()
    {
        var candidates = _context.Candidates.ToList();
        var vacancies = _context.Vacancies.ToList();
        var applications = _context.Applications.ToList();

        foreach (var candidate in candidates)
        {
            _context.Candidates.Remove(candidate);
        }

        foreach (var vacancy in vacancies)
        {
            _context.Vacancies.Remove(vacancy);
        }

        foreach (var application in applications)
        {
            _context.Applications.Remove(application);
        }

        SaveChanges();
    }
    private List<Candidate> GenerateCandidates(int number)
    {
        var candidates = new List<Candidate>();

        for (int i = 0; i < number; i++)
        {
            var candidate = new Candidate
            {
                Id = Guid.NewGuid(),
                FirstName = $"{new Faker().Name.FirstName()} {i + 1}",
                LastName = $"{new Faker().Name.LastName()} {i + 1}",
                //Resume = $"Resume for candidate {i + 1}",
                //Experience = new Random().Next(1, 10),
            };

            Candidates.Add(candidate);
            candidates.Add(candidate);
        }

        return candidates;
    }

    private List<Vacancy> GenerateVacancies(int number)
    {
        var vacancies = new List<Vacancy>();

        for (int i = 0; i < number; i++)
        {
            var vacancy = new Vacancy
            {
                Id = Guid.NewGuid(),
                Title = $"{new Faker().Commerce.Random.Word()} {i + 1}",
                Description = $"Description for vacancy {i + 1}",
                Quota = new Random().Next(1, 10),
                //Requirements = $"Requirements for vacancy {i + 1}",
                //Salary = new Random().Next(30000, 100000),
                CreatedAt = DateTime.Now,
                UpdatedAt = DateTime.Now
            };

            Vacancies.Add(vacancy);
            vacancies.Add(vacancy);
        }

        return vacancies;
    }

    private void GenerateApplications(List<Candidate> candidates, List<Vacancy> vacancies)
    {
        foreach (var candidate in candidates)
        {
            int numberOfApplications = new Random().Next(1, vacancies.Count + 1);
            var selectedVacancies = vacancies.OrderBy(x => Guid.NewGuid()).Take(numberOfApplications).ToList();

            foreach (var vacancy in selectedVacancies)
            {
                var application = new Application
                {
                    Id = Guid.NewGuid(),
                    CandidateId = candidate.Id,
                    VacancyId = vacancy.Id,
                    Score = Math.Max(0,
                    Math.Min(new Faker().Random.GaussianDouble(0.5, 0.2), 1)),
                    IsChosenByAlgorythm = false,
                    CreatedAt = DateTime.Now,
                    UpdatedAt = DateTime.Now
                };

                Applications.Add(application);
            }
        }
    }
}