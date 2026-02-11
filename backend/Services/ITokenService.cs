using FixLog.Api.Models;

namespace FixLog.Api.Services;

public interface ITokenService
{
    string GenerateToken(User user);
}
