using System.Security.Claims;
using FixLog.Api.DTOs;
using FixLog.Api.Extensions;
using FixLog.Api.Models;
using FixLog.Api.Services;

namespace FixLog.Api.Endpoints;

public static class AuthEndpoints
{
    public static void MapAuthEndpoints(this WebApplication app)
    {
        var group = app.MapGroup("/api/auth");

        group.MapPost("/register", async (RegisterRequest request, IAuthService authService) =>
        {
            if (string.IsNullOrWhiteSpace(request.Name) || request.Name.Length > 100)
                return Results.BadRequest(new { error = "Name is required and must be at most 100 characters" });
            if (string.IsNullOrWhiteSpace(request.Email) || request.Email.Length > 254)
                return Results.BadRequest(new { error = "Email is required and must be at most 254 characters" });
            if (string.IsNullOrWhiteSpace(request.Password) || request.Password.Length > 128)
                return Results.BadRequest(new { error = "Password is required and must be at most 128 characters" });

            var result = await authService.RegisterAsync(request);
            return result is null
                ? Results.Conflict(new { error = "Email already registered" })
                : Results.Ok(result);
        }).RequireRateLimiting("auth");

        group.MapPost("/login", async (LoginRequest request, IAuthService authService) =>
        {
            if (string.IsNullOrWhiteSpace(request.Email) || request.Email.Length > 254)
                return Results.BadRequest(new { error = "Email is required and must be at most 254 characters" });
            if (string.IsNullOrWhiteSpace(request.Password) || request.Password.Length > 128)
                return Results.BadRequest(new { error = "Password is required and must be at most 128 characters" });

            var result = await authService.LoginAsync(request);
            return result is null
                ? Results.Unauthorized()
                : Results.Ok(result);
        }).RequireRateLimiting("auth");

        group.MapGet("/refresh", (HttpContext ctx, ITokenService tokenService) =>
        {
            var userId = ctx.User.GetUserId();
            var name = ctx.User.FindFirstValue(ClaimTypes.Name) ?? "";
            var email = ctx.User.FindFirstValue(ClaimTypes.Email) ?? "";

            var user = new User { Id = userId, Name = name, Email = email };
            var token = tokenService.GenerateToken(user);
            return Results.Ok(new AuthResponse(token, new UserDto(userId, name, email)));
        }).RequireAuthorization();
    }
}
