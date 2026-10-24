namespace Capcache.Api.Services;

public static class DomainHelper
{
    /// <summary>Lower-case host without "www.", or an empty string when the URL is empty or invalid.</summary>
    public static string HostOf(string? url)
    {
        var u = url?.Trim();
        if (string.IsNullOrEmpty(u)) return "";
        if (!u.Contains("://")) u = "https://" + u;
        if (!Uri.TryCreate(u, UriKind.Absolute, out var uri) || uri.Scheme is not ("http" or "https")) return "";
        var host = uri.Host.ToLowerInvariant();
        return host.StartsWith("www.") ? host[4..] : host;
    }
}
