using Capcache.Api.Models;
using Capcache.Api.Services;
using Microsoft.EntityFrameworkCore;

namespace Capcache.Api.Data;

public class AppDbContext(DbContextOptions<AppDbContext> options, ICurrentUser currentUser) : DbContext(options)
{
    /// <summary>Names of the global query filters, so one can be lifted without the other.</summary>
    public const string SoftDeleteFilter = "SoftDelete";
    public const string OwnerFilter = "Owner";

    public DbSet<User> Users => Set<User>();
    public DbSet<Collection> Collections => Set<Collection>();
    public DbSet<Screenshot> Screenshots => Set<Screenshot>();

    // Read by the query filters. EF re-evaluates it for every context instance.
    private Guid CurrentUserId => currentUser.UserId;

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // Trigram indexes make "contains" search on title and URL fast.
        modelBuilder.HasPostgresExtension("pg_trgm");

        modelBuilder.Entity<User>(e =>
        {
            e.Property(u => u.Login).HasMaxLength(100);
            e.HasIndex(u => u.GitHubId).IsUnique();
        });

        modelBuilder.Entity<Collection>(e =>
        {
            e.Property(c => c.Name).HasMaxLength(100);
            e.HasOne<User>().WithMany().HasForeignKey(c => c.UserId).OnDelete(DeleteBehavior.Cascade);
            e.HasIndex(c => c.UserId);

            // Nobody can read or touch another user's data, even by guessing an id.
            e.HasQueryFilter(OwnerFilter, c => c.UserId == CurrentUserId);
        });

        modelBuilder.Entity<Screenshot>(e =>
        {
            e.Property(s => s.Title).HasMaxLength(300);
            e.Property(s => s.Url).HasMaxLength(2048);
            e.Property(s => s.Domain).HasMaxLength(255);
            e.Property(s => s.ImageKey).HasMaxLength(512);
            e.Property(s => s.ThumbnailKey).HasMaxLength(512);

            e.HasOne<User>().WithMany().HasForeignKey(s => s.UserId).OnDelete(DeleteBehavior.Cascade);
            // Deleting a collection keeps its screenshots, they just become uncategorized.
            e.HasOne<Collection>().WithMany().HasForeignKey(s => s.CollectionId).OnDelete(DeleteBehavior.SetNull);

            e.HasQueryFilter(OwnerFilter, s => s.UserId == CurrentUserId);
            // Soft delete: normal queries never see deleted rows. Undo and purge lift only this filter.
            e.HasQueryFilter(SoftDeleteFilter, s => s.DeletedAt == null);

            // Library list, newest first. Id is the tie-breaker so cursor paging is stable.
            e.HasIndex(s => new { s.UserId, s.CreatedAt, s.Id })
                .IsDescending(false, true, true)
                .HasFilter("\"DeletedAt\" IS NULL")
                .HasDatabaseName("IX_Screenshots_User_Newest");

            e.HasIndex(s => new { s.UserId, s.Domain, s.CreatedAt })
                .IsDescending(false, false, true)
                .HasFilter("\"DeletedAt\" IS NULL")
                .HasDatabaseName("IX_Screenshots_User_Domain");

            // Collection ids are unique, so this serves "one collection, newest first" and,
            // by leading with the foreign key, also the SET NULL lookup when a collection is deleted.
            e.HasIndex(s => new { s.CollectionId, s.CreatedAt, s.Id })
                .IsDescending(false, true, true)
                .HasFilter("\"DeletedAt\" IS NULL")
                .HasDatabaseName("IX_Screenshots_Collection_Newest");

            e.HasIndex(s => s.Title).HasMethod("gin").HasOperators("gin_trgm_ops")
                .HasFilter("\"DeletedAt\" IS NULL").HasDatabaseName("IX_Screenshots_Title_Trgm");
            e.HasIndex(s => s.Url).HasMethod("gin").HasOperators("gin_trgm_ops")
                .HasFilter("\"DeletedAt\" IS NULL").HasDatabaseName("IX_Screenshots_Url_Trgm");

            // For the purge job that removes old soft-deleted rows.
            e.HasIndex(s => s.DeletedAt)
                .HasFilter("\"DeletedAt\" IS NOT NULL")
                .HasDatabaseName("IX_Screenshots_DeletedAt");
        });
    }
}
