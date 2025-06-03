using System.Diagnostics;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MilitaryRecruitment.BusinessLogic.DTOs.Application;
using MilitaryRecruitment.BusinessLogic.Services;

namespace MilitaryRecruitment.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ApplicationsController : ControllerBase
{
    private readonly ApplicationService _applicationService;

    public ApplicationsController(ApplicationService applicationService)
    {
        _applicationService = applicationService;
    }

    [HttpGet]
    public IActionResult GetAllApplications()
    {
        var applications = _applicationService.GetAllApplications();
        return Ok(applications);
    }

    [HttpGet("{id}")]
    public IActionResult GetApplicationById(Guid id)
    {
        var application = _applicationService.GetApplicationById(id);
        if (application == null)
        {
            return NotFound();
        }
        return Ok(application);
    }

    [HttpPost]
    [Authorize]
    public IActionResult CreateApplication([FromBody] ApplicationCreateDto applicationDto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        _applicationService.CreateApplication(applicationDto);
        var createdApplication = _applicationService.GetAllApplications().Last();
        return CreatedAtAction(nameof(GetApplicationById), new { id = createdApplication.Id });
    }



    [HttpDelete("{id}")]
    [Authorize]
    public IActionResult DeleteApplication(Guid id)
    {
        _applicationService.DeleteApplication(id);
        return NoContent();
    }

    [HttpGet("candidate/{candidateId}")]
    public IActionResult GetApplicationsByCandidateId(Guid candidateId)
    {
        var applications = _applicationService.GetApplicationsByCandidateId(candidateId);
        return Ok(applications);
    }

    [HttpGet("vacancy/{vacancyId}")]
    public IActionResult GetApplicationsByVacancyId(Guid vacancyId)
    {
        var applications = _applicationService.GetApplicationsByVacancyId(vacancyId);
        return Ok(applications);
    }

    [HttpGet("candidate/{candidateId}/vacancy/{vacancyId}")]
    public IActionResult GetApplicationByCandidateIdAndVacancyId(Guid candidateId, Guid vacancyId)
    {
        var application = _applicationService.GetApplicationByCandidateIdAndVacancyId(candidateId, vacancyId);
        if (application == null)
        {
            return NotFound();
        }
        return Ok(application);
    }

    [HttpPost("run-algorithm")]
    //[Authorize]
    public IActionResult RunAssignmentAlgorithm()
    {
        Debug.WriteLine("Starting RunAssignmentAlgorithm");
        var results = _applicationService.RunMakAlgorithm();
        Debug.WriteLine($"Algorithm completed. Results count: {results.Count()}");
        return Ok(new
        {
            assignments = results
        });
    }

    [HttpPost("reset-assignments")]
    public IActionResult ResetAssignments()
    {
        _applicationService.ResetAllAssignments();
        return Ok("All application assignments have been reset.");
    }
}
