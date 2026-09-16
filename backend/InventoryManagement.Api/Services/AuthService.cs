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
    private readonly ManagerInvitationService _managerInvitationService;

   public AuthService(
    MongoDbContext db,
    PasswordHasher passwordHasher,
    TokenService tokenService,
    ManagerInvitationService managerInvitationService)
{
    _db = db;
    _passwordHasher = passwordHasher;
    _tokenService = tokenService;
    _managerInvitationService = managerInvitationService;
}

    public async Task<AuthResponse> RegisterManagerAsync(
    ManagerRegisterRequest request)
{
    if (string.IsNullOrWhiteSpace(request.Token))
    {
        throw new ArgumentException(
            "Invitation token is required.");
    }

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

    var invitation =
        await _managerInvitationService
            .GetValidInvitationAsync(request.Token);

    if (invitation == null)
    {
        throw new InvalidOperationException(
            "This invitation is invalid, expired, or already used.");
    }

    string username = request.Username.Trim();
    string email = request.Email.Trim();
    string name = request.Name.Trim();

    bool usernameExists = await _db.Users
        .Find(x => x.Username == username)
        .AnyAsync();

    if (usernameExists)
    {
        throw new InvalidOperationException(
            "Username is already registered.");
    }

    bool emailExists = await _db.Users
        .Find(x => x.Email == email)
        .AnyAsync();

    if (emailExists)
    {
        throw new InvalidOperationException(
            "Email is already registered.");
    }

    var (passwordHash, passwordSalt) =
        _passwordHasher.HashPassword(request.Password);

    var manager = new User
    {
        Username = username,
        Email = email,
        Name = name,
        PasswordHash = passwordHash,
        PasswordSalt = passwordSalt,
        Role = UserRole.Manager,
        DepartmentId = invitation.DepartmentId,
        IsActive = true,
        CreatedAt = DateTime.UtcNow
    };

    await _db.Users.InsertOneAsync(manager);

    bool invitationUsed =
        await _managerInvitationService
            .MarkAsUsedAsync(request.Token);

    if (!invitationUsed)
    {
        await _db.Users.DeleteOneAsync(
            x => x.Id == manager.Id);

        throw new InvalidOperationException(
            "This invitation has already been used.");
    }

    string jwt =
        _tokenService.CreateToken(manager);

    return new AuthResponse(
        jwt,
        manager.Id,
        manager.Username,
        manager.Name,
        manager.Role.ToString(),
        manager.DepartmentId);
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
        if (string.IsNullOrWhiteSpace(request.DepartmentId))
{
    throw new ArgumentException(
        "Department ID is required.");
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
            CreatedAt = DateTime.UtcNow,
            DepartmentId = request.DepartmentId.Trim(),
        };

        await _db.Users.InsertOneAsync(user);

        string token =
            _tokenService.CreateToken(user);

        return new AuthResponse(
    token,
    user.Id,
    user.Username,
    user.Name,
    user.Role.ToString(),
    user.DepartmentId);
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
    user.Role.ToString(),
    user.DepartmentId);
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