using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using MilitaryRecruitment.BusinessLogic.Services;
using MilitaryRecruitment.DataAccess;
using MilitaryRecruitment.DataAccess.Identity;
using MilitaryRecruitment.DataAccess.Repositories;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();

builder.Services.AddDbContext<MilitaryRecruitmentDbContext>(
    optionsBuilder => optionsBuilder.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")),
    contextLifetime: ServiceLifetime.Scoped);

builder.Services.AddIdentity<AppUser, IdentityRole>()
    .AddEntityFrameworkStores<MilitaryRecruitmentDbContext>()
    .AddDefaultTokenProviders();


builder.Services.AddTransient<UnitOfWork>();

builder.Services.AddTransient<CandidateRepository>();
builder.Services.AddTransient<VacancyRepository>();
builder.Services.AddTransient<ApplicationRepository>();

builder.Services.AddTransient<CandidateService>();
builder.Services.AddTransient<VacancyService>();
builder.Services.AddTransient<ApplicationService>();

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    //var context = services.GetRequiredService<MilitaryRecruitmentDbContext>();
    //context.Database.Migrate();
    //var userManager = services.GetRequiredService<UserManager<AppUser>>();
    //var roleManager = services.GetRequiredService<RoleManager<IdentityRole>>();
    //await SeedData(userManager, roleManager);

    var unitOfWork = services.GetRequiredService<UnitOfWork>();

    unitOfWork.ClearData();
    unitOfWork.GenerateData();
}

app.Run();
