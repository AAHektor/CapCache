using System.ComponentModel.DataAnnotations;

namespace Capcache.Api.Dtos;

public record ScreenshotDto(
    Guid Id,
    string Title,
    string Url,
    string Domain,
    string ThumbnailUrl,
    string ImageUrl,
    long SizeBytes,
    int Width,
    int Height,
    Guid? CollectionId,
    DateTimeOffset CreatedAt);

/// <summary>One page of results. <see cref="NextCursor"/> is null on the last page.</summary>
public record PagedResult<T>(IReadOnlyList<T> Items, string? NextCursor);

public enum SearchScope
{
    All,
    Title,
    Url,
}

public class ScreenshotQuery
{
    /// <summary>Opaque cursor from the previous page's <c>nextCursor</c>.</summary>
    public string? Cursor { get; set; }

    [Range(1, 100)]
    public int Limit { get; set; } = 40;

    /// <summary>Text to search for (case-insensitive "contains").</summary>
    [StringLength(200)]
    public string? Q { get; set; }

    public SearchScope Scope { get; set; } = SearchScope.All;

    public Guid? CollectionId { get; set; }

    [StringLength(255)]
    public string? Domain { get; set; }
}

/// <summary>Only the fields that are present are changed.</summary>
public class UpdateScreenshotRequest
{
    [StringLength(300, MinimumLength = 1)]
    public string? Title { get; set; }

    /// <summary>Empty string clears the URL. The domain is re-derived from it.</summary>
    [StringLength(2048)]
    public string? Url { get; set; }
}

public class MoveScreenshotRequest
{
    /// <summary>Target collection, or null to remove the screenshot from its collection.</summary>
    public Guid? CollectionId { get; set; }
}
