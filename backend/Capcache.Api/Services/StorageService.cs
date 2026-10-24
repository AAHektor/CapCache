using Microsoft.Extensions.Options;

namespace Capcache.Api.Services;

public class StorageOptions
{
    public const string Section = "Storage";

    /// <summary>Base URL objects are served from, for example the R2 public bucket URL.</summary>
    public string PublicBaseUrl { get; set; } = "";
}

/// <summary>
/// S3-compatible storage (R2 / MinIO). Stage 2 only builds URLs; uploading arrives in stage 3.
/// </summary>
public class StorageService(IOptions<StorageOptions> options) : IStorageService
{
    private readonly string _baseUrl = options.Value.PublicBaseUrl.TrimEnd('/');

    public string GetUrl(string key) => $"{_baseUrl}/{key}";
}
