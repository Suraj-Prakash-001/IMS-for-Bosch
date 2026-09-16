using System.Security.Cryptography;
using InventoryManagement.Api.Data;
using InventoryManagement.Api.Models.Entities;
using MongoDB.Driver;

namespace InventoryManagement.Api.Services;

public class ManagerInvitationService
{
    private readonly MongoDbContext _db;
    private readonly IConfiguration _configuration;

    public ManagerInvitationService(
        MongoDbContext db,
        IConfiguration configuration)
    {
        _db = db;
        _configuration = configuration;
    }

    public async Task<(ManagerInvitation Invitation, string RegistrationUrl)>
        CreateInvitationAsync(string departmentId)
    {
        if (string.IsNullOrWhiteSpace(departmentId))
        {
            throw new ArgumentException(
                "Department ID is required.");
        }

        departmentId = departmentId.Trim();

        // Prevent multiple active invitations for the same department.
        var existingInvitation = await _db.ManagerInvitations
            .Find(x =>
                x.DepartmentId == departmentId &&
                !x.Used &&
                x.ExpiresAt > DateTime.UtcNow)
            .FirstOrDefaultAsync();

        if (existingInvitation != null)
        {
            throw new InvalidOperationException(
                "An active invitation already exists for this department.");
        }

        // Generate a cryptographically strong one-time token.
        var tokenBytes = RandomNumberGenerator.GetBytes(32);

        var token = Convert.ToBase64String(tokenBytes)
            .Replace("+", "-")
            .Replace("/", "_")
            .Replace("=", "");

        var invitation = new ManagerInvitation
        {
            Token = token,
            DepartmentId = departmentId,
            CreatedAt = DateTime.UtcNow,
            ExpiresAt = DateTime.UtcNow.AddHours(24),
            Used = false
        };

        await _db.ManagerInvitations.InsertOneAsync(invitation);

        var frontendBaseUrl =
            _configuration["Frontend:BaseUrl"]
            ?? "http://localhost:5173";

        var registrationUrl =
            $"{frontendBaseUrl.TrimEnd('/')}/register/manager/{token}";

        return (invitation, registrationUrl);
    }

    public async Task<ManagerInvitation?> GetValidInvitationAsync(
        string token)
    {
        if (string.IsNullOrWhiteSpace(token))
        {
            return null;
        }

        var invitation = await _db.ManagerInvitations
            .Find(x =>
                x.Token == token &&
                !x.Used &&
                x.ExpiresAt > DateTime.UtcNow)
            .FirstOrDefaultAsync();

        return invitation;
    }

    public async Task<bool> MarkAsUsedAsync(string token)
    {
        var update = Builders<ManagerInvitation>.Update
            .Set(x => x.Used, true)
            .Set(x => x.UsedAt, DateTime.UtcNow);

        var result = await _db.ManagerInvitations.UpdateOneAsync(
            x =>
                x.Token == token &&
                !x.Used &&
                x.ExpiresAt > DateTime.UtcNow,
            update);

        return result.ModifiedCount == 1;
    }
}