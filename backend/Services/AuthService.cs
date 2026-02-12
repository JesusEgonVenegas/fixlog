using FixLog.Api.Data;
using FixLog.Api.DTOs;
using FixLog.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace FixLog.Api.Services;

public class AuthService : IAuthService
{
    private readonly FixLogDbContext _db;
    private readonly ITokenService _tokenService;

    public AuthService(FixLogDbContext db, ITokenService tokenService)
    {
        _db = db;
        _tokenService = tokenService;
    }

    public async Task<AuthResponse?> RegisterAsync(RegisterRequest request)
    {
        if (request.Password.Length < 8
            || !request.Password.Any(char.IsUpper)
            || !request.Password.Any(char.IsLower)
            || !request.Password.Any(char.IsDigit))
        {
            throw new ArgumentException(
                "Password must be at least 8 characters and include uppercase, lowercase, and a number");
        }

        if (await _db.Users.AnyAsync(u => u.Email == request.Email))
            return null;

        var user = new User
        {
            Name = request.Name,
            Email = request.Email,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password)
        };

        _db.Users.Add(user);
        await _db.SaveChangesAsync();

        var token = _tokenService.GenerateToken(user);
        return new AuthResponse(token, new UserDto(user.Id, user.Name, user.Email));
    }

    public async Task<AuthResponse?> LoginAsync(LoginRequest request)
    {
        var user = await _db.Users.FirstOrDefaultAsync(u => u.Email == request.Email);
        if (user is null || !BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
            return null;

        var token = _tokenService.GenerateToken(user);
        return new AuthResponse(token, new UserDto(user.Id, user.Name, user.Email));
    }
}
