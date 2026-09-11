using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using InventoryManagement.Api.Models.Entities;
using Microsoft.IdentityModel.Tokens;

namespace InventoryManagement.Api.Services;

public class TokenService
{
    private readonly IConfiguration _configuration;

    public TokenService(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    public string CreateToken(User user)
    {
        string key = _configuration["Jwt:Key"]
            ?? throw new InvalidOperationException(
                "Jwt:Key is missing from configuration.");

        string issuer =
            _configuration["Jwt:Issuer"]
            ?? "InventoryManagement.Api";

        string audience =
            _configuration["Jwt:Audience"]
            ?? "InventoryManagement.Client";

        if (key.Length < 32)
        {
            throw new InvalidOperationException(
                "Jwt:Key must be at least 32 characters long.");
        }

        var claims = new List<Claim>
        {
            new(
                JwtRegisteredClaimNames.Sub,
                user.Id),

            new(
                ClaimTypes.NameIdentifier,
                user.Id),

            new(
                ClaimTypes.Name,
                user.Username),

            new(
                ClaimTypes.Role,
                user.Role.ToString())
        };

        var securityKey =
            new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(key));

        var credentials =
            new SigningCredentials(
                securityKey,
                SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            issuer: issuer,
            audience: audience,
            claims: claims,
            notBefore: DateTime.UtcNow,
            expires: DateTime.UtcNow.AddHours(8),
            signingCredentials: credentials);

        return new JwtSecurityTokenHandler()
            .WriteToken(token);
    }
}