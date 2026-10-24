using Capcache.Api.Data;
using Capcache.Api.Services;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// The connection string comes from user-secrets in development and from the
// ConnectionStrings__Default environment variable elsewhere. Never from source.
var connectionString = builder.Configuration.GetConnectionString("Default")
    ?? throw new InvalidOperationException(
        "Missing connection string. Set ConnectionStrings:Default (user-secrets) or ConnectionStrings__Default (environment).");

builder.Services.AddControllers();
builder.Services.AddDbContext<AppDbContext>(options => options.UseNpgsql(connectionString));

builder.Services.Configure<StorageOptions>(builder.Configuration.GetSection(StorageOptions.Section));
builder.Services.AddSingleton<IStorageService, StorageService>();
builder.Services.AddScoped<CollectionService>();
builder.Services.AddScoped<ScreenshotService>();
builder.Services.AddScoped<DomainService>();

// Real sign-in (GitHub OAuth) arrives in stage 4. Until then the stub user only exists in
// development, so the API cannot be started elsewhere with everyone signed in as one person.
if (builder.Environment.IsDevelopment())
    builder.Services.AddScoped<ICurrentUser, DevCurrentUser>();
else
    throw new InvalidOperationException("Authentication is not implemented yet. Run in the Development environment.");

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    using var scope = app.Services.CreateScope();
    await DevSeeder.SeedAsync(scope.ServiceProvider.GetRequiredService<AppDbContext>());
}

app.MapControllers();

app.MapGet("/health", async (AppDbContext db, CancellationToken ct) =>
    await db.Database.CanConnectAsync(ct)
        ? Results.Ok(new { status = "ok" })
        : Results.Problem("Database unreachable", statusCode: StatusCodes.Status503ServiceUnavailable));

app.Run();
