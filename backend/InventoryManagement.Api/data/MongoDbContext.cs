using InventoryManagement.Api.Models.Entities;

public IMongoCollection<Category> Categories =>
    _database.GetCollection<Category>("categories");

public IMongoCollection<Product> Products =>
    _database.GetCollection<Product>("products");

public IMongoCollection<PhysicalAsset> PhysicalAssets =>
    _database.GetCollection<PhysicalAsset>("physicalAssets");

public IMongoCollection<Order> Orders =>
    _database.GetCollection<Order>("orders");