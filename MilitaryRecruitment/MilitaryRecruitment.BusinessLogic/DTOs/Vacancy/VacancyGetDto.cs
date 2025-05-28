namespace MilitaryRecruitment.BusinessLogic.DTOs.Vacancy;

public class VacancyGetDto
{
    public Guid Id { get; set; }
    public string Title { get; set; }
    public string Description { get; set; }
    public int Quota { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}
