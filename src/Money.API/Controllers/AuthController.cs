using Microsoft.AspNetCore.Mvc;
using Money.Application.DTOs.Auth;
using Money.Application.Interfaces;

namespace Money.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;

    public AuthController(IAuthService authService)
    {
        _authService = authService;
    }

    [HttpPost("register")]
    public async Task<ActionResult<string>> Register([FromBody] RegisterUserDto dto)
    {
        try
        {
            var token = await _authService.RegisterAsync(dto);
            return Ok(token);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpPost("login")]
    public async Task<ActionResult<string>> Login([FromBody] LoginUserDto dto)
    {
        try
        {
            var token = await _authService.LoginAsync(dto);
            return Ok(token);
        }
        catch (Exception ex)
        {
            return Unauthorized(ex.Message);
        }
    }
}
