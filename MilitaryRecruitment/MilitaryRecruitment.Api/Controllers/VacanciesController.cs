using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MilitaryRecruitment.BusinessLogic.DTOs.Vacancy;
using MilitaryRecruitment.BusinessLogic.Services;

namespace MilitaryRecruitment.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class VacanciesController : ControllerBase
{
    private readonly VacancyService _vacancyService;

    public VacanciesController(VacancyService vacancyService)
    {
        _vacancyService = vacancyService;
    }

    [HttpGet]
    public IActionResult GetAllVacancies()
    {
        var vacancies = _vacancyService.GetAllVacancies();
        return Ok(vacancies);
    }

    [HttpGet("{id}")]
    public IActionResult GetVacancyById(Guid id)
    {
        var vacancy = _vacancyService.GetVacancyById(id);
        if (vacancy == null)
        {
            return NotFound();
        }
        return Ok(vacancy);
    }

    [HttpPost]
    [Authorize]
    public IActionResult CreateVacancy([FromBody] VacancyCreateDto vacancyDto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        _vacancyService.CreateVacancy(vacancyDto);
        var createdVacancyId = _vacancyService.GetAllVacancies().Last().Id;
        return CreatedAtAction(nameof(GetVacancyById), new { id = createdVacancyId });
    }



    [HttpDelete("{id}")]
    [Authorize]
    public IActionResult DeleteVacancy(Guid id)
    {
        _vacancyService.DeleteVacancy(id);
        return NoContent();
    }
}
