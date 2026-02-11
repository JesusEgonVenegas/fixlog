using FixLog.Api.DTOs;
using FixLog.Api.Extensions;
using FixLog.Api.Services;

namespace FixLog.Api.Endpoints;

public static class ProblemEndpoints
{
    public static void MapProblemEndpoints(this WebApplication app)
    {
        var group = app.MapGroup("/api/problems").RequireAuthorization();

        group.MapGet("/", (HttpContext ctx, IProblemService svc) =>
        {
            var userId = ctx.User.GetUserId();
            var problems = svc.GetByUser(userId);
            return Results.Ok(problems.Select(p => ToResponse(p)));
        });

        group.MapGet("/{id}", (string id, HttpContext ctx, IProblemService svc) =>
        {
            var problem = svc.GetById(id, ctx.User.GetUserId());
            return problem is null ? Results.NotFound() : Results.Ok(ToResponse(problem));
        });

        group.MapPost("/", (CreateProblemRequest req, HttpContext ctx, IProblemService svc) =>
        {
            var problem = svc.Create(ctx.User.GetUserId(), req.Title, req.Description, req.Solution, req.Tags);
            return Results.Created($"/api/problems/{problem.Id}", ToResponse(problem));
        });

        group.MapPut("/{id}", (string id, UpdateProblemRequest req, HttpContext ctx, IProblemService svc) =>
        {
            var problem = svc.Update(id, ctx.User.GetUserId(), req.Title, req.Description, req.Solution, req.Tags);
            return problem is null ? Results.NotFound() : Results.Ok(ToResponse(problem));
        });

        group.MapDelete("/{id}", (string id, HttpContext ctx, IProblemService svc) =>
        {
            return svc.Delete(id, ctx.User.GetUserId())
                ? Results.NoContent()
                : Results.NotFound();
        });
    }

    private static ProblemResponse ToResponse(FixLog.Api.Models.Problem p) =>
        new(p.Id, p.Title, p.Description, p.Solution, p.Tags, p.CreatedAt, p.UpdatedAt, p.UserId);
}
