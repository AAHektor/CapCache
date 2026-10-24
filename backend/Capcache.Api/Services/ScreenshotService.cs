using System.Buffers.Text;
using System.Text;
using Capcache.Api.Data;
using Capcache.Api.Dtos;
using Capcache.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace Capcache.Api.Services;

public class ScreenshotService(AppDbContext db, IStorageService storage)
{
    // The query filters already limit everything to the current user's non-deleted rows.

    public async Task<PagedResult<ScreenshotDto>?> ListAsync(ScreenshotQuery query, CancellationToken ct)
    {
        IQueryable<Screenshot> screenshots = db.Screenshots;

        if (query.CollectionId is { } collectionId)
            screenshots = screenshots.Where(s => s.CollectionId == collectionId);
        if (!string.IsNullOrEmpty(query.Domain))
            screenshots = screenshots.Where(s => s.Domain == query.Domain);

        var text = query.Q?.Trim();
        if (!string.IsNullOrEmpty(text))
        {
            var pattern = $"%{EscapeLike(text)}%";
            screenshots = query.Scope switch
            {
                SearchScope.Title => screenshots.Where(s => EF.Functions.ILike(s.Title, pattern, "\\")),
                SearchScope.Url => screenshots.Where(s => EF.Functions.ILike(s.Url, pattern, "\\")),
                _ => screenshots.Where(s =>
                    EF.Functions.ILike(s.Title, pattern, "\\") || EF.Functions.ILike(s.Url, pattern, "\\")),
            };
        }

        if (query.Cursor is not null)
        {
            if (!TryDecodeCursor(query.Cursor, out var createdAt, out var id)) return null;
            screenshots = screenshots.Where(s =>
                s.CreatedAt < createdAt || (s.CreatedAt == createdAt && s.Id.CompareTo(id) < 0));
        }

        // Fetch one extra row to learn whether there is a next page.
        var rows = await screenshots
            .OrderByDescending(s => s.CreatedAt).ThenByDescending(s => s.Id)
            .Take(query.Limit + 1)
            .ToListAsync(ct);

        var hasMore = rows.Count > query.Limit;
        if (hasMore) rows.RemoveAt(rows.Count - 1);

        var next = hasMore ? EncodeCursor(rows[^1]) : null;
        return new PagedResult<ScreenshotDto>(rows.Select(ToDto).ToList(), next);
    }

    public async Task<ScreenshotDto?> GetAsync(Guid id, CancellationToken ct)
    {
        var screenshot = await db.Screenshots.FirstOrDefaultAsync(s => s.Id == id, ct);
        return screenshot is null ? null : ToDto(screenshot);
    }

    public async Task<ScreenshotDto?> UpdateAsync(Guid id, UpdateScreenshotRequest request, CancellationToken ct)
    {
        var screenshot = await db.Screenshots.FirstOrDefaultAsync(s => s.Id == id, ct);
        if (screenshot is null) return null;

        if (request.Title is not null) screenshot.Title = request.Title.Trim();
        if (request.Url is not null)
        {
            screenshot.Url = request.Url.Trim();
            screenshot.Domain = DomainHelper.HostOf(screenshot.Url);
        }
        await db.SaveChangesAsync(ct);
        return ToDto(screenshot);
    }

    /// <summary>Reports separately whether the screenshot and the target collection exist.</summary>
    public async Task<(bool Found, bool CollectionFound, ScreenshotDto? Result)> MoveAsync(
        Guid id, Guid? collectionId, CancellationToken ct)
    {
        var screenshot = await db.Screenshots.FirstOrDefaultAsync(s => s.Id == id, ct);
        if (screenshot is null) return (false, true, null);

        if (collectionId is not null && !await db.Collections.AnyAsync(c => c.Id == collectionId, ct))
            return (true, false, null);

        screenshot.CollectionId = collectionId;
        await db.SaveChangesAsync(ct);
        return (true, true, ToDto(screenshot));
    }

    /// <summary>Soft delete. The row and files stay until a later purge, so this can be undone.</summary>
    public async Task<bool> DeleteAsync(Guid id, CancellationToken ct)
    {
        var screenshot = await db.Screenshots.FirstOrDefaultAsync(s => s.Id == id, ct);
        if (screenshot is null) return false;

        screenshot.DeletedAt = DateTimeOffset.UtcNow;
        await db.SaveChangesAsync(ct);
        return true;
    }

    public async Task<ScreenshotDto?> RestoreAsync(Guid id, CancellationToken ct)
    {
        // Lift only the soft-delete filter. The owner filter still applies.
        var screenshot = await db.Screenshots.IgnoreQueryFilters([AppDbContext.SoftDeleteFilter])
            .FirstOrDefaultAsync(s => s.Id == id && s.DeletedAt != null, ct);
        if (screenshot is null) return null;

        screenshot.DeletedAt = null;
        // The collection may have been deleted in the meantime.
        if (screenshot.CollectionId is { } cid && !await db.Collections.AnyAsync(c => c.Id == cid, ct))
            screenshot.CollectionId = null;
        await db.SaveChangesAsync(ct);
        return ToDto(screenshot);
    }

    private ScreenshotDto ToDto(Screenshot s) => new(
        s.Id, s.Title, s.Url, s.Domain,
        storage.GetUrl(s.ThumbnailKey), storage.GetUrl(s.ImageKey),
        s.SizeBytes, s.Width, s.Height, s.CollectionId, s.CreatedAt);

    private static string EscapeLike(string text) =>
        text.Replace("\\", "\\\\").Replace("%", "\\%").Replace("_", "\\_");

    // Cursor = "<UTC ticks>.<id>", base64url encoded. It only marks a position, so nothing secret is in it.
    private static string EncodeCursor(Screenshot s) =>
        Base64Url.EncodeToString(Encoding.UTF8.GetBytes($"{s.CreatedAt.UtcTicks}.{s.Id:N}"));

    private static bool TryDecodeCursor(string cursor, out DateTimeOffset createdAt, out Guid id)
    {
        createdAt = default;
        id = default;
        try
        {
            var parts = Encoding.UTF8.GetString(Base64Url.DecodeFromChars(cursor)).Split('.');
            if (parts.Length != 2 || !long.TryParse(parts[0], out var ticks) || !Guid.TryParseExact(parts[1], "N", out id))
                return false;
            createdAt = new DateTimeOffset(ticks, TimeSpan.Zero);
            return true;
        }
        catch (Exception e) when (e is FormatException or ArgumentOutOfRangeException)
        {
            return false;
        }
    }
}
