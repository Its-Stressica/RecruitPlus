namespace MilitaryRecruitment.BusinessLogic.DTOs.Application;

public class AlgorithmResultDto
{
    public Guid Id { get; set; }
    public string CandidateName { get; set; }
    public string VacancyTitle { get; set; }
    public double Score { get; set; }
    public bool IsChosenByAlgorithm { get; set; }
}
