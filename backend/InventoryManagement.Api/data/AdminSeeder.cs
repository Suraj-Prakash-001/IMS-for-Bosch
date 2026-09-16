using InventoryManagement.Api.Models.Entities;
using InventoryManagement.Api.Models.Enums;
using InventoryManagement.Api.Services;
using MongoDB.Driver;

namespace InventoryManagement.Api.Data;

public class AdminSeeder
{
    private readonly MongoDbContext _db;
    private readonly PasswordHasher _passwordHasher;
    private readonly IConfiguration _configuration;

    public AdminSeeder(
        MongoDbContext db,
        PasswordHasher passwordHasher,
        IConfiguration configuration)
    {
        _db = db;
        _passwordHasher = passwordHasher;
        _configuration = configuration;
    }

    public async Task SeedAsync()
    {
        var username = _configuration["SeedAdmin:Username"];
        var password = _configuration["SeedAdmin:Password"];
        var email = _configuration["SeedAdmin:Email"];
        var name = _configuration["SeedAdmin:Name"];

        if (string.IsNullOrWhiteSpace(username) ||
            string.IsNullOrWhiteSpace(password) ||
            string.IsNullOrWhiteSpace(email) ||
            string.IsNullOrWhiteSpace(name))
        {
            throw new InvalidOperationException(
                "SeedAdmin configuration is missing.");
        }

        var existingAdmin = await _db.Users
            .Find(u => u.Username == username)
            .FirstOrDefaultAsync();

        if (existingAdmin != null)
        {
            Console.WriteLine(
                $"Admin '{username}' already exists.");
            return;
        }

        var (hash, salt) =
            _passwordHasher.HashPassword(password);

        var admin = new User
        {
            Username = username,
            Email = email,
            Name = name,
            PasswordHash = hash,
            PasswordSalt = salt,
            Role = UserRole.Admin,
            IsActive = true,
            CreatedAt = DateTime.UtcNow
        };

        await _db.Users.InsertOneAsync(admin);

        Console.WriteLine(
            $"Admin '{username}' created successfully.");
    }
}