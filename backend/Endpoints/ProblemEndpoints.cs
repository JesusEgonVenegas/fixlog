using FixLog.Api.DTOs;
using FixLog.Api.Extensions;
using FixLog.Api.Services;

namespace FixLog.Api.Endpoints;

public static class ProblemEndpoints
{
    public static void MapProblemEndpoints(this WebApplication app)
    {
        var group = app.MapGroup("/api/problems").RequireAuthorization();

        group.MapGet("/", async (HttpContext ctx, IProblemService svc) =>
        {
            var userId = ctx.User.GetUserId();
            var problems = await svc.GetByUserAsync(userId);
            return Results.Ok(problems.Select(p => ToResponse(p)));
        });

        group.MapGet("/{id}", async (string id, HttpContext ctx, IProblemService svc) =>
        {
            var problem = await svc.GetByIdAsync(id, ctx.User.GetUserId());
            return problem is null ? Results.NotFound() : Results.Ok(ToResponse(problem));
        });

        group.MapPost("/", async (CreateProblemRequest req, HttpContext ctx, IProblemService svc) =>
        {
            var error = ValidateCreateRequest(req);
            if (error is not null) return error;

            var problem = await svc.CreateAsync(ctx.User.GetUserId(), req.Title, req.Description, req.Solution, req.Tags);
            return Results.Created($"/api/problems/{problem.Id}", ToResponse(problem));
        });

        group.MapPut("/{id}", async (string id, UpdateProblemRequest req, HttpContext ctx, IProblemService svc) =>
        {
            var error = ValidateUpdateRequest(req);
            if (error is not null) return error;

            var problem = await svc.UpdateAsync(id, ctx.User.GetUserId(), req.Title, req.Description, req.Solution, req.Tags);
            return problem is null ? Results.NotFound() : Results.Ok(ToResponse(problem));
        });

        group.MapDelete("/{id}", async (string id, HttpContext ctx, IProblemService svc) =>
        {
            return await svc.DeleteAsync(id, ctx.User.GetUserId())
                ? Results.NoContent()
                : Results.NotFound();
        });
    }

    private static IResult? ValidateCreateRequest(CreateProblemRequest req)
    {
        if (string.IsNullOrWhiteSpace(req.Title) || req.Title.Length > 200)
            return Results.BadRequest(new { error = "Title is required and must be at most 200 characters" });
        if (req.Description.Length > 10_000)
            return Results.BadRequest(new { error = "Description must be at most 10,000 characters" });
        if (req.Solution.Length > 10_000)
            return Results.BadRequest(new { error = "Solution must be at most 10,000 characters" });
        if (req.Tags.Count > 10)
            return Results.BadRequest(new { error = "At most 10 tags allowed" });
        if (req.Tags.Any(t => t.Length > 50))
            return Results.BadRequest(new { error = "Each tag must be at most 50 characters" });
        return null;
    }

    private static IResult? ValidateUpdateRequest(UpdateProblemRequest req)
    {
        if (req.Title is not null && (string.IsNullOrWhiteSpace(req.Title) || req.Title.Length > 200))
            return Results.BadRequest(new { error = "Title must be non-empty and at most 200 characters" });
        if (req.Description is not null && req.Description.Length > 10_000)
            return Results.BadRequest(new { error = "Description must be at most 10,000 characters" });
        if (req.Solution is not null && req.Solution.Length > 10_000)
            return Results.BadRequest(new { error = "Solution must be at most 10,000 characters" });
        if (req.Tags is not null && req.Tags.Count > 10)
            return Results.BadRequest(new { error = "At most 10 tags allowed" });
        if (req.Tags is not null && req.Tags.Any(t => t.Length > 50))
            return Results.BadRequest(new { error = "Each tag must be at most 50 characters" });
        return null;
    }

    private static ProblemResponse ToResponse(FixLog.Api.Models.Problem p) =>
        new(p.Id, p.Title, p.Description, p.Solution, p.Tags, p.CreatedAt, p.UpdatedAt, p.UserId);
}
