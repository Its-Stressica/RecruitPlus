﻿namespace MilitaryRecruitment.DataAccess.Entities;

public class Candidate
{
    public Guid Id { get; set; }
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
}
