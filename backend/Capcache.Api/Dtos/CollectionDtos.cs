using System.ComponentModel.DataAnnotations;

namespace Capcache.Api.Dtos;

public record CollectionDto(Guid Id, string Name, int ColorIndex, int ScreenshotCount);

public class CreateCollectionRequest
{
    [Required, StringLength(100, MinimumLength = 1)]
    public string Name { get; set; } = "";

    [Range(0, 99)]
    public int ColorIndex { get; set; }
}

/// <summary>Only the fields that are present are changed.</summary>
public class UpdateCollectionRequest
{
    [StringLength(100, MinimumLength = 1)]
    public string? Name { get; set; }

    [Range(0, 99)]
    public int? ColorIndex { get; set; }
}
