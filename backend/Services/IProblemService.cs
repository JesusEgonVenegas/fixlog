using FixLog.Api.Models;

namespace FixLog.Api.Services;

public interface IProblemService
{
    List<Problem> GetByUser(string userId);
    Problem? GetById(string id, string userId);
    Problem Create(string userId, string title, string description, string solution, List<string> tags);
    Problem? Update(string id, string userId, string? title, string? description, string? solution, List<string>? tags);
    bool Delete(string id, string userId);
}
