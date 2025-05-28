namespace MilitaryRecruitment.BusinessLogic.Services;

using DTOs.Candidate;
using DTOs.Application;
using MilitaryRecruitment.DataAccess;
using MilitaryRecruitment.DataAccess.Repositories;
using MilitaryRecruitment.DataAccess.Entities;

public class CandidateService
{
    private readonly UnitOfWork _unitOfWork;
    private readonly CandidateRepository _candidateRepository;

    public CandidateService(UnitOfWork unitOfWork, CandidateRepository candidateRepository)
    {
        _unitOfWork = unitOfWork;
        _candidateRepository = candidateRepository;
    }

    public IEnumerable<CandidateGetDto> GetAllCandidates()
    {
        var candidates = _candidateRepository.GetAll();
        return candidates.Select(c => new CandidateGetDto
        {
            Id = c.Id,
            FirstName = c.FirstName,
            LastName = c.LastName,
        });
    }

    public CandidateGetDto GetCandidateById(Guid id)
    {
        var candidate = _candidateRepository.GetById(id);
        if (candidate == null) return null;

        return new CandidateGetDto
        {
            Id = candidate.Id,
            FirstName = candidate.FirstName,
            LastName = candidate.LastName,
        };
    }

    public void CreateCandidate(CandidateCreateDto candidateDto)
    {
        var candidate = new Candidate
        {
            FirstName = candidateDto.FirstName,
            LastName = candidateDto.LastName,
        };

        _candidateRepository.Add(candidate);
        _unitOfWork.SaveChanges();
    }

    public void DeleteCandidate(Guid id)
    {
        var candidate = _candidateRepository.GetById(id);
        if (candidate != null)
        {
            _candidateRepository.Delete(candidate);
            _unitOfWork.SaveChanges();
        }
    }
}
