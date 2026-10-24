namespace Capcache.Api.Models;

public class User
{
    public Guid Id { get; set; }

    /// <summary>GitHub's numeric account id. Stable, unlike the login which can be renamed.</summary>
    public long GitHubId { get; set; }

    public string Login { get; set; } = "";

    public DateTimeOffset CreatedAt { get; set; }
}
