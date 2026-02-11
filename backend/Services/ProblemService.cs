using System.Collections.Concurrent;
using FixLog.Api.Models;

namespace FixLog.Api.Services;

public class ProblemService : IProblemService
{
    private readonly ConcurrentDictionary<string, Problem> _problems = new();

    public List<Problem> GetByUser(string userId)
    {
        return _problems.Values
            .Where(p => p.UserId == userId)
            .OrderByDescending(p => p.CreatedAt)
            .ToList();
    }

    public Problem? GetById(string id, string userId)
    {
        return _problems.GetValueOrDefault(id) is { } p && p.UserId == userId ? p : null;
    }

    public Problem Create(string userId, string title, string description, string solution, List<string> tags)
    {
        var problem = new Problem
        {
            Title = title,
            Description = description,
            Solution = solution,
            Tags = tags,
            UserId = userId
        };
        _problems[problem.Id] = problem;
        return problem;
    }

    public Problem? Update(string id, string userId, string? title, string? description, string? solution, List<string>? tags)
    {
        if (_problems.GetValueOrDefault(id) is not { } problem || problem.UserId != userId)
            return null;

        if (title is not null) problem.Title = title;
        if (description is not null) problem.Description = description;
        if (solution is not null) problem.Solution = solution;
        if (tags is not null) problem.Tags = tags;
        problem.UpdatedAt = DateTime.UtcNow;

        return problem;
    }

    public bool Delete(string id, string userId)
    {
        if (_problems.GetValueOrDefault(id) is not { } problem || problem.UserId != userId)
            return false;

        return _problems.TryRemove(id, out _);
    }
}
