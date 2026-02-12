using System.Collections.Concurrent;
using FixLog.Api.DTOs;
using FixLog.Api.Models;

namespace FixLog.Api.Services;

public class AuthService : IAuthService
{
    private readonly ConcurrentDictionary<string, User> _users = new();
    private readonly ITokenService _tokenService;

    public AuthService(ITokenService tokenService)
    {
        _tokenService = tokenService;
    }

    public AuthResponse? Register(RegisterRequest request)
    {
        if (request.Password.Length < 8
            || !request.Password.Any(char.IsUpper)
            || !request.Password.Any(char.IsLower)
            || !request.Password.Any(char.IsDigit))
        {
            throw new ArgumentException(
                "Password must be at least 8 characters and include uppercase, lowercase, and a number");
        }

        if (_users.Values.Any(u => u.Email == request.Email))
            return null;

        var user = new User
        {
            Name = request.Name,
            Email = request.Email,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password)
        };

        _users[user.Id] = user;
        var token = _tokenService.GenerateToken(user);
        return new AuthResponse(token, new UserDto(user.Id, user.Name, user.Email));
    }

    public AuthResponse? Login(LoginRequest request)
    {
        var user = _users.Values.FirstOrDefault(u => u.Email == request.Email);
        if (user is null || !BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
            return null;

        var token = _tokenService.GenerateToken(user);
        return new AuthResponse(token, new UserDto(user.Id, user.Name, user.Email));
    }
}
