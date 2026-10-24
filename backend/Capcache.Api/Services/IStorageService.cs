namespace Capcache.Api.Services;

/// <summary>Where image files live: R2 in production, MinIO locally. Both speak S3.</summary>
public interface IStorageService
{
    /// <summary>Public URL a browser can load the object from.</summary>
    string GetUrl(string key);
}
