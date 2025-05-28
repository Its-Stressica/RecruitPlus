using MilitaryRecruitment.BusinessLogic.DTOs.Candidate;

namespace MilitaryRecruitment.BusinessLogic.Interfaces;
public interface ICandidateService
{
    IEnumerable<CandidateGetDto> GetAllCandidatesAsync();
    CandidateGetDto GetCandidateByIdAsync(int id);
    CandidateGetDto CreateCandidateAsync(CandidateGetDto candidateDto);
    void UpdateCandidateAsync(int id, CandidateGetDto candidateDto);
    void DeleteCandidateAsync(int id);
}
