using InventoryManagement.Api.Models.Entities;
using MongoDB.Driver;

namespace InventoryManagement.Api.Data;

public class MongoDbContext
{
    private readonly IMongoDatabase _database;

    public MongoDbContext(MongoDbSettings settings)
    {
        var client = new MongoClient(settings.ConnectionString);
        _database = client.GetDatabase(settings.DatabaseName);
    }

    public IMongoCollection<User> Users =>
        _database.GetCollection<User>("users");

    public IMongoCollection<Location> Locations =>
        _database.GetCollection<Location>("locations");

    public IMongoCollection<Building> Buildings =>
        _database.GetCollection<Building>("buildings");

    public IMongoCollection<Floor> Floors =>
        _database.GetCollection<Floor>("floors");

    public IMongoCollection<Section> Sections =>
        _database.GetCollection<Section>("sections");

    public IMongoCollection<Seat> Seats =>
        _database.GetCollection<Seat>("seats");

    public IMongoCollection<Category> Categories =>
        _database.GetCollection<Category>("categories");

    public IMongoCollection<Product> Products =>
        _database.GetCollection<Product>("products");

    public IMongoCollection<PhysicalAsset> PhysicalAssets =>
        _database.GetCollection<PhysicalAsset>("physicalAssets");

    public IMongoCollection<Order> Orders =>
        _database.GetCollection<Order>("orders");
}