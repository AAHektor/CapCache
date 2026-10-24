using Capcache.Api.Models;
using Capcache.Api.Services;
using Microsoft.EntityFrameworkCore;

namespace Capcache.Api.Data;

/// <summary>
/// Development only: creates the stub user and some example data so the API has something to
/// return before uploads exist (stage 3). Image keys are fake, so the files themselves 404.
/// </summary>
public static class DevSeeder
{
    private static readonly (string Domain, string Title, string Path, int Collection)[] Rows =
    [
        ("github.com", "Fix: virtualized grid jumps on resize · Pull Request #482", "/capcache/web/pull/482", 1),
        ("developer.mozilla.org", "IntersectionObserver - Web APIs | MDN", "/en-US/docs/Web/API/IntersectionObserver", 2),
        ("app.datadoghq.eu", "API latency — p95 by endpoint", "/dashboard/abc-123/api-latency", 1),
        ("figma.com", "Capcache — Library v3", "/design/Kx82/Capcache?node-id=412-2201", 0),
        ("react.dev", "useDeferredValue – React", "/reference/react/useDeferredValue", 2),
        ("arxiv.org", "[2304.08485] Visual Instruction Tuning", "/abs/2304.08485", 3),
        ("vercel.com", "Deployments – capcache-web – Vercel", "/capcache/capcache-web/deployments", -1),
        ("stackoverflow.com", "How do I virtualize a masonry layout in React?", "/questions/78112043/virtualize-masonry", 2),
        ("tailwindcss.com", "Dark mode - Core concepts - Tailwind CSS", "/docs/dark-mode", 2),
        ("supabase.com", "Table editor | capcache-prod | Supabase", "/dashboard/project/capcache-prod/editor", -1),
        ("web.dev", "Serve images in modern formats", "/articles/serve-images-webp", 2),
        ("are.na", "Calm interfaces — Are.na", "/capcache/calm-interfaces", 0),
    ];

    private static readonly string[] CollectionNames =
        ["Design inspiration", "Bugs & errors", "Docs & tutorials", "Research"];

    public static async Task SeedAsync(AppDbContext db)
    {
        if (!await db.Users.AnyAsync(u => u.Id == DevCurrentUser.DevUserId))
        {
            db.Users.Add(new User
            {
                Id = DevCurrentUser.DevUserId,
                GitHubId = 0,
                Login = "dev",
                CreatedAt = DateTimeOffset.UtcNow,
            });
            await db.SaveChangesAsync();
        }

        if (await db.Collections.AnyAsync() || await db.Screenshots.AnyAsync()) return;

        var now = DateTimeOffset.UtcNow;
        var collections = CollectionNames.Select((name, i) => new Collection
        {
            Id = Guid.NewGuid(),
            UserId = DevCurrentUser.DevUserId,
            Name = name,
            ColorIndex = i,
            CreatedAt = now.AddMinutes(i),
        }).ToList();
        db.Collections.AddRange(collections);

        // 60 rows, two per timestamp, so paging across equal timestamps gets exercised.
        for (var i = 0; i < 60; i++)
        {
            var (domain, title, path, collection) = Rows[i % Rows.Length];
            var round = i / Rows.Length;
            var n = Guid.NewGuid().ToString("N");
            db.Screenshots.Add(new Screenshot
            {
                Id = Guid.NewGuid(),
                UserId = DevCurrentUser.DevUserId,
                CollectionId = collection < 0 ? null : collections[collection].Id,
                Title = round == 0 ? title : $"{title} ({round + 1})",
                Url = $"https://{domain}{path}",
                Domain = domain,
                ImageKey = $"dev/{n}.webp",
                ThumbnailKey = $"dev/{n}-thumb.webp",
                SizeBytes = 90_000 + (i * 7919 % 90_000),
                Width = 1440,
                Height = 900,
                CreatedAt = now.AddHours(-7 * (i / 2)),
            });
        }
        await db.SaveChangesAsync();
    }
}
