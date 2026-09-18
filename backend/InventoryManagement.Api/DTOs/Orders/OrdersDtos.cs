namespace InventoryManagement.Api.DTOs.Orders;
using Microsoft.AspNetCore.Http;

public record CreateOrderRequest(
    List<CreateOrderItemRequest> Items);

public record CreateOrderItemRequest(
    string ProductId,
    int Quantity);

public record RejectOrderRequest(
    string Comment);

public record CreateProductRequest(
    string CategoryId,
    string Name,
    string Sku,
    string Description,
    decimal Price,
    int StockQuantity,
    IFormFile? Image);