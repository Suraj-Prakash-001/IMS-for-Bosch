using Microsoft.AspNetCore.Http;

namespace InventoryManagement.Api.DTOs.Catalog;

public record CreateCategoryRequest(
    string Name,
    string? Description);

public record UpdateStockRequest(
    int Quantity);

public record CreateProductRequest(
    string CategoryId,
    string Name,
    string Sku,
    string Description,
    decimal Price,
    int StockQuantity,
    IFormFile? Image);