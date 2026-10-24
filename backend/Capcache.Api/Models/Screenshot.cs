namespace Capcache.Api.Models;

public class Screenshot
{
    public Guid Id { get; set; }

    public Guid UserId { get; set; }

    public Guid? CollectionId { get; set; }

    public string Title { get; set; } = "";

    /// <summary>Page the screenshot was taken of. Empty when the user gave none.</summary>
    public string Url { get; set; } = "";

    /// <summary>Host derived from <see cref="Url"/> (lower case, no "www."). Stored so it can be filtered and counted in SQL.</summary>
    public string Domain { get; set; } = "";

    /// <summary>Object key of the full-size WebP in storage.</summary>
    public string ImageKey { get; set; } = "";

    /// <summary>Object key of the small WebP (about 400 px wide) used by the grid.</summary>
    public string ThumbnailKey { get; set; } = "";

    public long SizeBytes { get; set; }

    public int Width { get; set; }

    public int Height { get; set; }

    public DateTimeOffset CreatedAt { get; set; }

    /// <summary>Set when deleted. The row and files are purged later, so delete can be undone.</summary>
    public DateTimeOffset? DeletedAt { get; set; }
}
