using FixLog.Api.Data;
using FixLog.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace FixLog.Api.Services;

public class ProblemService : IProblemService
{
    private readonly FixLogDbContext _db;

    public ProblemService(FixLogDbContext db)
    {
        _db = db;
    }

    public async Task<List<Problem>> GetByUserAsync(string userId)
    {
        return await _db.Problems
            .Where(p => p.UserId == userId)
            .OrderByDescending(p => p.CreatedAt)
            .ToListAsync();
    }

    public async Task<Problem?> GetByIdAsync(string id, string userId)
    {
        return await _db.Problems
            .FirstOrDefaultAsync(p => p.Id == id && p.UserId == userId);
    }

    public async Task<Problem> CreateAsync(string userId, string title, string description, string solution, List<string> tags)
    {
        var problem = new Problem
        {
            Title = title,
            Description = description,
            Solution = solution,
            Tags = tags,
            UserId = userId
        };
        _db.Problems.Add(problem);
        await _db.SaveChangesAsync();
        return problem;
    }

    public async Task<Problem?> UpdateAsync(string id, string userId, string? title, string? description, string? solution, List<string>? tags)
    {
        var problem = await _db.Problems
            .FirstOrDefaultAsync(p => p.Id == id && p.UserId == userId);
        if (problem is null)
            return null;

        if (title is not null) problem.Title = title;
        if (description is not null) problem.Description = description;
        if (solution is not null) problem.Solution = solution;
        if (tags is not null) problem.Tags = tags;
        problem.UpdatedAt = DateTime.UtcNow;

        await _db.SaveChangesAsync();
        return problem;
    }

    public async Task<bool> DeleteAsync(string id, string userId)
    {
        var problem = await _db.Problems
            .FirstOrDefaultAsync(p => p.Id == id && p.UserId == userId);
        if (problem is null)
            return false;

        _db.Problems.Remove(problem);
        await _db.SaveChangesAsync();
        return true;
    }
}
