using MilitaryRecruitment.DataAccess.Entities;

namespace MilitaryRecruitment.DataAccess.Repositories;

public class ApplicationRepository
{
    private readonly MilitaryRecruitmentDbContext _context;

    public ApplicationRepository(MilitaryRecruitmentDbContext context)
    {
        _context = context;
    }

    public void Add(Application application)
    {
        _context.Applications.Add(application);
    }
    public void Update(Application application)
    {
        _context.Applications.Update(application);
    }
    public void Delete(Application application)
    {
        _context.Applications.Remove(application);
    }
    public Application GetById(Guid id)
    {
        return _context.Applications.Find(id);
    }
    public IEnumerable<Application> GetAll()
    {
        return _context.Applications.ToList();
    }
    public IEnumerable<Application> GetByCandidateId(Guid candidateId)
    {
        return _context.Applications.Where(a => a.CandidateId == candidateId).ToList();
    }
    public IEnumerable<Application> GetByVacancyId(Guid vacancyId)
    {
        return _context.Applications.Where(a => a.VacancyId == vacancyId).ToList();
    }
    public IEnumerable<Application> GetByCandidateIdAndVacancyId(Guid candidateId, Guid vacancyId)
    {
        return _context.Applications.Where(a => a.CandidateId == candidateId && a.VacancyId == vacancyId).ToList();
    }
    public IEnumerable<Application> GetByCandidateIdAndVacancyIdAndIsChosenByAlgorythm(Guid candidateId, Guid vacancyId, bool isChosenByAlgorythm)
    {
        return _context.Applications.Where(a => a.CandidateId == candidateId && a.VacancyId == vacancyId && a.IsChosenByAlgorythm == isChosenByAlgorythm).ToList();
    }

}