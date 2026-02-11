namespace FixLog.Api.DTOs;

public record LoginRequest(string Email, string Password);

public record RegisterRequest(string Name, string Email, string Password);

public record AuthResponse(string Token, UserDto User);

public record UserDto(string Id, string Name, string Email);
