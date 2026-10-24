namespace Capcache.Api.Models;

public class Collection
{
    public Guid Id { get; set; }

    public Guid UserId { get; set; }

    public string Name { get; set; } = "";

    /// <summary>Index into the color palette the frontend defines.</summary>
    public int ColorIndex { get; set; }

    public DateTimeOffset CreatedAt { get; set; }
}
