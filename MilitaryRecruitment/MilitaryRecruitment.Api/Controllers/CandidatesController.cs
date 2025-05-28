using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MilitaryRecruitment.BusinessLogic.DTOs.Candidate;
using MilitaryRecruitment.BusinessLogic.Services;

namespace MilitaryRecruitment.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CandidatesController : ControllerBase
{
    private readonly CandidateService _candidateService;

    public CandidatesController(CandidateService candidateService)
    {
        _candidateService = candidateService;
    }

    [HttpGet]
    public IActionResult GetAllCandidates()
    {
        var candidates = _candidateService.GetAllCandidates();
        return Ok(candidates);
    }

    [HttpGet("{id}")]
    public IActionResult GetCandidateById(Guid id)
    {
        var candidate = _candidateService.GetCandidateById(id);
        if (candidate == null)
        {
            return NotFound();
        }
        return Ok(candidate);
    }

    [HttpPost]
    [Authorize]
    public IActionResult CreateCandidate([FromBody] CandidateCreateDto candidateDto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        _candidateService.CreateCandidate(candidateDto);
        var createdCandidateId = _candidateService.GetAllCandidates().Last().Id;
        return CreatedAtAction(nameof(GetCandidateById), new { id = createdCandidateId });
    }



    [HttpDelete("{id}")]
    [Authorize]
    public IActionResult DeleteCandidate(Guid id)
    {
        _candidateService.DeleteCandidate(id);
        return NoContent();
    }
}
