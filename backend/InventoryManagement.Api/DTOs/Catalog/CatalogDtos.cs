namespace InventoryManagement.Api.DTOs.Catalog;

public record CreateCategoryRequest(
    string Name,
    string? Description);

public record UpdateStockRequest(
    int Quantity);