using FixLog.Api.DTOs;

namespace FixLog.Api.Services;

public interface IAuthService
{
    AuthResponse? Register(RegisterRequest request);
    AuthResponse? Login(LoginRequest request);
}
