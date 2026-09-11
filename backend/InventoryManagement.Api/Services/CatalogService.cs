using InventoryManagement.Api.Data;
using InventoryManagement.Api.DTOs.Catalog;
using InventoryManagement.Api.Models.Entities;
using MongoDB.Driver;

namespace InventoryManagement.Api.Services;

public class CatalogService
{
    private readonly MongoDbContext _db;
    private readonly IWebHostEnvironment _environment;

    public CatalogService(
        MongoDbContext db,
        IWebHostEnvironment environment)
    {
        _db = db;
        _environment = environment;
    }

    // =====================================================
    // CATEGORIES
    // =====================================================

    public async Task<Category> CreateCategoryAsync(
        CreateCategoryRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Name))
        {
            throw new ArgumentException(
                "Category name is required.");
        }

        string name = request.Name.Trim();

        bool exists =
            await _db.Categories
                .Find(x => x.Name == name)
                .AnyAsync();

        if (exists)
        {
            throw new InvalidOperationException(
                $"Category '{name}' already exists.");
        }

        var category = new Category
        {
            Name = name,
            Description =
                request.Description?.Trim() ?? string.Empty,
            CreatedAt = DateTime.UtcNow
        };

        await _db.Categories.InsertOneAsync(category);

        return category;
    }

    public async Task<List<Category>> GetCategoriesAsync()
    {
        return await _db.Categories
            .Find(_ => true)
            .SortBy(x => x.Name)
            .ToListAsync();
    }

    // =====================================================
    // PRODUCTS
    // =====================================================

    public async Task<Product> CreateProductAsync(
        string categoryId,
        string name,
        string sku,
        string description,
        decimal price,
        int stockQuantity,
        IFormFile? image)
    {
        if (string.IsNullOrWhiteSpace(categoryId))
        {
            throw new ArgumentException(
                "Category ID is required.");
        }

        if (string.IsNullOrWhiteSpace(name))
        {
            throw new ArgumentException(
                "Product name is required.");
        }

        if (string.IsNullOrWhiteSpace(sku))
        {
            throw new ArgumentException(
                "SKU is required.");
        }

        if (price < 0)
        {
            throw new ArgumentException(
                "Price cannot be negative.");
        }

        if (stockQuantity < 0)
        {
            throw new ArgumentException(
                "Stock quantity cannot be negative.");
        }

        bool categoryExists =
            await _db.Categories
                .Find(x => x.Id == categoryId)
                .AnyAsync();

        if (!categoryExists)
        {
            throw new ArgumentException(
                "The specified category does not exist.");
        }

        string normalizedSku =
            sku.Trim().ToUpperInvariant();

        bool skuExists =
            await _db.Products
                .Find(x => x.SKU == normalizedSku)
                .AnyAsync();

        if (skuExists)
        {
            throw new InvalidOperationException(
                $"SKU '{normalizedSku}' already exists.");
        }

        string imageUrl = string.Empty;

        if (image != null && image.Length > 0)
        {
            imageUrl =
                await SaveProductImageAsync(image);
        }

        var product = new Product
        {
            CategoryId = categoryId,
            Name = name.Trim(),
            SKU = normalizedSku,
            Description = description?.Trim() ?? string.Empty,
            Price = price,
            StockQuantity = stockQuantity,
            ImageUrl = imageUrl,
            IsActive = true,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        await _db.Products.InsertOneAsync(product);

        return product;
    }

    public async Task<List<Product>> GetProductsAsync(
        string? categoryId = null)
    {
        FilterDefinition<Product> filter =
            Builders<Product>.Filter.Eq(
                x => x.IsActive,
                true);

        if (!string.IsNullOrWhiteSpace(categoryId))
        {
            filter =
                Builders<Product>.Filter.And(
                    filter,
                    Builders<Product>.Filter.Eq(
                        x => x.CategoryId,
                        categoryId));
        }

        return await _db.Products
            .Find(filter)
            .SortBy(x => x.Name)
            .ToListAsync();
    }

    public async Task<Product?> GetProductByIdAsync(
        string id)
    {
        if (string.IsNullOrWhiteSpace(id))
        {
            throw new ArgumentException(
                "Product ID is required.");
        }

        return await _db.Products
            .Find(x => x.Id == id)
            .FirstOrDefaultAsync();
    }

    // =====================================================
    // STOCK
    // =====================================================

    public async Task<Product?> UpdateStockAsync(
        string productId,
        int quantity)
    {
        if (string.IsNullOrWhiteSpace(productId))
        {
            throw new ArgumentException(
                "Product ID is required.");
        }

        if (quantity < 0)
        {
            throw new ArgumentException(
                "Stock quantity cannot be negative.");
        }

        var update =
            Builders<Product>.Update
                .Set(x => x.StockQuantity, quantity)
                .Set(x => x.UpdatedAt, DateTime.UtcNow);

        return await _db.Products
            .FindOneAndUpdateAsync(
                x => x.Id == productId &&
                     x.IsActive,
                update,
                new FindOneAndUpdateOptions<Product>
                {
                    ReturnDocument =
                        ReturnDocument.After
                });
    }

// =====================================================
// PHYSICAL ASSETS
// =====================================================

public async Task<PhysicalAsset> CreatePhysicalAssetAsync(
    CreatePhysicalAssetRequest request)
{
    if (string.IsNullOrWhiteSpace(request.ProductId))
    {
        throw new ArgumentException(
            "Product ID is required.");
    }

    if (string.IsNullOrWhiteSpace(request.AssetTag))
    {
        throw new ArgumentException(
            "Asset tag is required.");
    }

    string assetTag =
        request.AssetTag.Trim().ToUpperInvariant();

    var product =
        await _db.Products
            .Find(x =>
                x.Id == request.ProductId &&
                x.IsActive)
            .FirstOrDefaultAsync();

    if (product == null)
    {
        throw new ArgumentException(
            "The specified product does not exist.");
    }

    bool assetTagExists =
        await _db.PhysicalAssets
            .Find(x => x.AssetTag == assetTag)
            .AnyAsync();

    if (assetTagExists)
    {
        throw new InvalidOperationException(
            $"Asset tag '{assetTag}' already exists.");
    }

    if (!string.IsNullOrWhiteSpace(request.SeatId))
    {
        bool seatExists =
            await _db.Seats
                .Find(x => x.Id == request.SeatId)
                .AnyAsync();

        if (!seatExists)
        {
            throw new ArgumentException(
                "The specified seat does not exist.");
        }
    }

    var asset = new PhysicalAsset
    {
        ProductId = product.Id,
        AssetTag = assetTag,
        SerialNumber =
            request.SerialNumber?.Trim() ?? string.Empty,
        SeatId = string.IsNullOrWhiteSpace(request.SeatId)
            ? null
            : request.SeatId,
        Condition =
            string.IsNullOrWhiteSpace(request.Condition)
                ? "Good"
                : request.Condition.Trim(),
        Status =
            string.IsNullOrWhiteSpace(request.Status)
                ? "Available"
                : request.Status.Trim(),
        AssignedToUserId =
            string.IsNullOrWhiteSpace(request.AssignedToUserId)
                ? null
                : request.AssignedToUserId,
        CreatedAt = DateTime.UtcNow,
        UpdatedAt = DateTime.UtcNow
    };

    await _db.PhysicalAssets.InsertOneAsync(asset);

    return asset;
}

public async Task<List<PhysicalAsset>> GetPhysicalAssetsAsync(
    string? productId = null,
    string? seatId = null)
{
    var filters =
        new List<FilterDefinition<PhysicalAsset>>();

    if (!string.IsNullOrWhiteSpace(productId))
    {
        filters.Add(
            Builders<PhysicalAsset>.Filter.Eq(
                x => x.ProductId,
                productId));
    }

    if (!string.IsNullOrWhiteSpace(seatId))
    {
        filters.Add(
            Builders<PhysicalAsset>.Filter.Eq(
                x => x.SeatId,
                seatId));
    }

    var filter =
        filters.Count == 0
            ? Builders<PhysicalAsset>
                .Filter
                .Empty
            : Builders<PhysicalAsset>
                .Filter
                .And(filters);

    return await _db.PhysicalAssets
        .Find(filter)
        .SortBy(x => x.AssetTag)
        .ToListAsync();
}

public async Task<PhysicalAsset?> GetPhysicalAssetByIdAsync(
    string id)
{
    if (string.IsNullOrWhiteSpace(id))
    {
        throw new ArgumentException(
            "Physical asset ID is required.");
    }

    return await _db.PhysicalAssets
        .Find(x => x.Id == id)
        .FirstOrDefaultAsync();
}

public async Task<PhysicalAsset?> UpdatePhysicalAssetAsync(
    string id,
    UpdatePhysicalAssetRequest request)
{
    if (string.IsNullOrWhiteSpace(id))
    {
        throw new ArgumentException(
            "Physical asset ID is required.");
    }

    if (!string.IsNullOrWhiteSpace(request.SeatId))
    {
        bool seatExists =
            await _db.Seats
                .Find(x => x.Id == request.SeatId)
                .AnyAsync();

        if (!seatExists)
        {
            throw new ArgumentException(
                "The specified seat does not exist.");
        }
    }

    var update =
        Builders<PhysicalAsset>.Update
            .Set(
                x => x.SeatId,
                string.IsNullOrWhiteSpace(request.SeatId)
                    ? null
                    : request.SeatId)
            .Set(
                x => x.Condition,
                string.IsNullOrWhiteSpace(request.Condition)
                    ? "Good"
                    : request.Condition.Trim())
            .Set(
                x => x.Status,
                string.IsNullOrWhiteSpace(request.Status)
                    ? "Available"
                    : request.Status.Trim())
            .Set(
                x => x.AssignedToUserId,
                string.IsNullOrWhiteSpace(
                    request.AssignedToUserId)
                    ? null
                    : request.AssignedToUserId)
            .Set(
                x => x.UpdatedAt,
                DateTime.UtcNow);

    return await _db.PhysicalAssets
        .FindOneAndUpdateAsync(
            x => x.Id == id,
            update,
            new FindOneAndUpdateOptions<PhysicalAsset>
            {
                ReturnDocument =
                    ReturnDocument.After
            });
}

    // =====================================================
    // IMAGE
    // =====================================================

    private async Task<string> SaveProductImageAsync(
        IFormFile image)
    {
        string[] allowedExtensions =
        {
            ".jpg",
            ".jpeg",
            ".png",
            ".webp"
        };

        string extension =
            Path.GetExtension(image.FileName)
                .ToLowerInvariant();

        if (!allowedExtensions.Contains(extension))
        {
            throw new ArgumentException(
                "Only JPG, JPEG, PNG and WEBP images are allowed.");
        }

        const long maxFileSize =
            5 * 1024 * 1024;

        if (image.Length > maxFileSize)
        {
            throw new ArgumentException(
                "Product image cannot exceed 5 MB.");
        }

        string webRoot =
            _environment.WebRootPath
            ?? Path.Combine(
                _environment.ContentRootPath,
                "wwwroot");

        string uploadDirectory =
            Path.Combine(
                webRoot,
                "uploads",
                "products");

        Directory.CreateDirectory(uploadDirectory);

        string fileName =
            $"{Guid.NewGuid():N}{extension}";

        string filePath =
            Path.Combine(
                uploadDirectory,
                fileName);

        await using var stream =
            new FileStream(
                filePath,
                FileMode.CreateNew);

        await image.CopyToAsync(stream);

        return $"/uploads/products/{fileName}";
    }
}