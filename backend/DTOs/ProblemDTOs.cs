namespace FixLog.Api.DTOs;

public record CreateProblemRequest(
    string Title,
    string Description,
    string Solution,
    List<string> Tags
);

public record UpdateProblemRequest(
    string? Title,
    string? Description,
    string? Solution,
    List<string>? Tags
);

public record ProblemResponse(
    string Id,
    string Title,
    string Description,
    string Solution,
    List<string> Tags,
    DateTime CreatedAt,
    DateTime UpdatedAt,
    string UserId
);
