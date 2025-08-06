using Money.Application.DTOs.Auth;

namespace Money.Application.Interfaces;

public interface IAuthService
{
    Task<string> RegisterAsync(RegisterUserDto dto);
    Task<string> LoginAsync(LoginUserDto dto);
}
