using MilitaryRecruitment.DataAccess.Entities;

namespace MilitaryRecruitment.DataAccess.Repositories;

public class VacancyRepository
{
    // not async

    private readonly MilitaryRecruitmentDbContext _context;
    public VacancyRepository(MilitaryRecruitmentDbContext context)
    {
        _context = context;
    }
    public void Add(Vacancy vacancy)
    {
        _context.Vacancies.Add(vacancy);
    }
    public void Update(Vacancy vacancy)
    {
        _context.Vacancies.Update(vacancy);
    }
    public void Delete(Vacancy vacancy)
    {
        _context.Vacancies.Remove(vacancy);
    }
    public Vacancy GetById(Guid id)
    {
        return _context.Vacancies.Find(id);
    }
    public IEnumerable<Vacancy> GetAll()
    {
        return _context.Vacancies.ToList();
    }

}