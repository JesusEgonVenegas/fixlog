using FixLog.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace FixLog.Api.Data;

public class FixLogDbContext : DbContext
{
    public FixLogDbContext(DbContextOptions<FixLogDbContext> options) : base(options) { }

    public DbSet<User> Users => Set<User>();
    public DbSet<Problem> Problems => Set<Problem>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<User>(e =>
        {
            e.HasIndex(u => u.Email).IsUnique();
        });

        modelBuilder.Entity<Problem>(e =>
        {
            e.HasIndex(p => p.UserId);
        });
    }
}
