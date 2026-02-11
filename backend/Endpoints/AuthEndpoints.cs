using FixLog.Api.DTOs;
using FixLog.Api.Services;

namespace FixLog.Api.Endpoints;

public static class AuthEndpoints
{
    public static void MapAuthEndpoints(this WebApplication app)
    {
        var group = app.MapGroup("/api/auth");

        group.MapPost("/register", (RegisterRequest request, IAuthService authService) =>
        {
            var result = authService.Register(request);
            return result is null
                ? Results.Conflict(new { error = "Email already registered" })
                : Results.Ok(result);
        });

        group.MapPost("/login", (LoginRequest request, IAuthService authService) =>
        {
            var result = authService.Login(request);
            return result is null
                ? Results.Unauthorized()
                : Results.Ok(result);
        });
    }
}
