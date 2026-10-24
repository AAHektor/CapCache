using Capcache.Api.Data;
using Capcache.Api.Dtos;
using Capcache.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace Capcache.Api.Services;

public class CollectionService(AppDbContext db, ICurrentUser currentUser)
{
    // The query filters already limit everything to the current user.
    public async Task<List<CollectionDto>> ListAsync(CancellationToken ct) =>
        await db.Collections
            .OrderBy(c => c.CreatedAt).ThenBy(c => c.Id)
            .Select(c => new CollectionDto(
                c.Id, c.Name, c.ColorIndex, db.Screenshots.Count(s => s.CollectionId == c.Id)))
            .ToListAsync(ct);

    public async Task<CollectionDto> CreateAsync(CreateCollectionRequest request, CancellationToken ct)
    {
        var collection = new Collection
        {
            Id = Guid.NewGuid(),
            UserId = currentUser.UserId,
            Name = request.Name.Trim(),
            ColorIndex = request.ColorIndex,
            CreatedAt = DateTimeOffset.UtcNow,
        };
        db.Collections.Add(collection);
        await db.SaveChangesAsync(ct);
        return new CollectionDto(collection.Id, collection.Name, collection.ColorIndex, 0);
    }

    public async Task<CollectionDto?> UpdateAsync(Guid id, UpdateCollectionRequest request, CancellationToken ct)
    {
        var collection = await db.Collections.FirstOrDefaultAsync(c => c.Id == id, ct);
        if (collection is null) return null;

        if (request.Name is not null) collection.Name = request.Name.Trim();
        if (request.ColorIndex is not null) collection.ColorIndex = request.ColorIndex.Value;
        await db.SaveChangesAsync(ct);

        var count = await db.Screenshots.CountAsync(s => s.CollectionId == id, ct);
        return new CollectionDto(collection.Id, collection.Name, collection.ColorIndex, count);
    }

    /// <summary>Screenshots in the collection are kept and become uncategorized.</summary>
    public async Task<bool> DeleteAsync(Guid id, CancellationToken ct)
    {
        var collection = await db.Collections.FirstOrDefaultAsync(c => c.Id == id, ct);
        if (collection is null) return false;

        // Soft-deleted screenshots are hidden by the filter, so null them out explicitly too.
        await db.Screenshots.IgnoreQueryFilters([AppDbContext.SoftDeleteFilter])
            .Where(s => s.CollectionId == id)
            .ExecuteUpdateAsync(set => set.SetProperty(s => s.CollectionId, (Guid?)null), ct);

        db.Collections.Remove(collection);
        await db.SaveChangesAsync(ct);
        return true;
    }
}
