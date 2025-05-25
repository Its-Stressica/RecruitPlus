using Microsoft.AspNetCore.Identity;

namespace MilitaryRecruitment.DataAccess.Identity;

public class AppUser : IdentityUser
{
    public string Name { get; set; } = string.Empty;
}