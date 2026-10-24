using Capcache.Api.Data;
using Capcache.Api.Dtos;
using Microsoft.EntityFrameworkCore;

namespace Capcache.Api.Services;

public class DomainService(AppDbContext db)
{
    /// <summary>Domains with their screenshot count, most screenshots first.</summary>
    public async Task<List<DomainCountDto>> ListAsync(CancellationToken ct)
    {
        var rows = await db.Screenshots
            .Where(s => s.Domain != "")
            .GroupBy(s => s.Domain)
            .Select(g => new { Domain = g.Key, Count = g.Count() })
            .OrderByDescending(d => d.Count).ThenBy(d => d.Domain)
            .ToListAsync(ct);
        return rows.Select(d => new DomainCountDto(d.Domain, d.Count)).ToList();
    }
}
