using InventoryManagement.Api.Data;
using InventoryManagement.Api.DTOs.Auth;
using InventoryManagement.Api.Models.Entities;
using InventoryManagement.Api.Models.Enums;
using MongoDB.Driver;

namespace InventoryManagement.Api.Services;

public class AuthService
{
    private readonly MongoDbContext _db;
    private readonly PasswordHasher _passwordHasher;
    private readonly TokenService _tokenService;

    public AuthService(
        MongoDbContext db,
        PasswordHasher passwordHasher,
        TokenService tokenService)
    {
        _db = db;
        _passwordHasher = passwordHasher;
        _tokenService = tokenService;
    }

    public async Task<AuthResponse> RegisterCustomerAsync(
        RegisterRequest request)
    {
        ValidateRegistrationRequest(request);

        string username =
            request.Username.Trim();

        string email =
            request.Email.Trim().ToLowerInvariant();

        var existingUser = await _db.Users
            .Find(x =>
                x.Username.ToLower() == username.ToLower() ||
                x.Email.ToLower() == email)
            .FirstOrDefaultAsync();

        if (existingUser != null)
        {
            if (string.Equals(
                    existingUser.Username,
                    username,
                    StringComparison.OrdinalIgnoreCase))
            {
                throw new InvalidOperationException(
                    "Username already exists.");
            }

            throw new InvalidOperationException(
                "Email already exists.");
        }

        var (hash, salt) =
            _passwordHasher.HashPassword(
                request.Password);

        var user = new User
        {
            Username = username,
            Email = email,
            Name = request.Name.Trim(),
            PasswordHash = hash,
            PasswordSalt = salt,
            Role = UserRole.Customer,
            IsActive = true,
            CreatedAt = DateTime.UtcNow
        };

        await _db.Users.InsertOneAsync(user);

        string token =
            _tokenService.CreateToken(user);

        return new AuthResponse(
            token,
            user.Id,
            user.Username,
            user.Name,
            user.Role.ToString());
    }

    public async Task<AuthResponse?> LoginAsync(
        LoginRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Username) ||
            string.IsNullOrWhiteSpace(request.Password))
        {
            return null;
        }

        var username =
            request.Username.Trim();

        var user = await _db.Users
            .Find(x =>
                x.Username == username &&
                x.IsActive)
            .FirstOrDefaultAsync();

        if (user == null)
        {
            return null;
        }

        bool passwordValid =
            _passwordHasher.VerifyPassword(
                request.Password,
                user.PasswordHash,
                user.PasswordSalt);

        if (!passwordValid)
        {
            return null;
        }

        string token =
            _tokenService.CreateToken(user);

        return new AuthResponse(
            token,
            user.Id,
            user.Username,
            user.Name,
            user.Role.ToString());
    }

    private static void ValidateRegistrationRequest(
        RegisterRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Username))
        {
            throw new ArgumentException(
                "Username is required.");
        }

        if (string.IsNullOrWhiteSpace(request.Email))
        {
            throw new ArgumentException(
                "Email is required.");
        }

        if (string.IsNullOrWhiteSpace(request.Name))
        {
            throw new ArgumentException(
                "Name is required.");
        }

        if (string.IsNullOrWhiteSpace(request.Password))
        {
            throw new ArgumentException(
                "Password is required.");
        }

        if (request.Password.Length < 8)
        {
            throw new ArgumentException(
                "Password must contain at least 8 characters.");
        }
    }
}