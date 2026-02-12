using FixLog.Api.Models;

namespace FixLog.Api.Services;

public interface IProblemService
{
    Task<List<Problem>> GetByUserAsync(string userId);
    Task<Problem?> GetByIdAsync(string id, string userId);
    Task<Problem> CreateAsync(string userId, string title, string description, string solution, List<string> tags);
    Task<Problem?> UpdateAsync(string id, string userId, string? title, string? description, string? solution, List<string>? tags);
    Task<bool> DeleteAsync(string id, string userId);
}
