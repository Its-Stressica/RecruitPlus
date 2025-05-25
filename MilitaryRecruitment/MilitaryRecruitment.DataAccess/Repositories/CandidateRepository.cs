using MilitaryRecruitment.DataAccess.Entities;

namespace MilitaryRecruitment.DataAccess.Repositories;

public class CandidateRepository
{
    private readonly MilitaryRecruitmentDbContext _context;

    public CandidateRepository(MilitaryRecruitmentDbContext context)
    {
        _context = context;
    }

    public void Add(Candidate candidate)
    {
        _context.Candidates.Add(candidate);
    }

    public void Update(Candidate candidate)
    {
        _context.Candidates.Update(candidate);
    }

    public void Delete(Candidate candidate)
    {
        _context.Candidates.Remove(candidate);
    }

    public Candidate GetById(Guid id)
    {
        return _context.Candidates.Find(id);
    }

    public IEnumerable<Candidate> GetAll()
    {
        return _context.Candidates.ToList();
    }
}