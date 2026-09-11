namespace InventoryManagement.Api.DTOs.Auth;

public record RegisterRequest(
    string Username,
    string Email,
    string Name,
    string Password);

public record LoginRequest(
    string Username,
    string Password);

public record AuthResponse(
    string Token,
    string UserId,
    string Username,
    string Name,
    string Role);