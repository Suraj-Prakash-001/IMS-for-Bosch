namespace InventoryManagement.Api.DTOs.Orders;

public record CreateOrderRequest(
    List<CreateOrderItemRequest> Items);

public record CreateOrderItemRequest(
    string ProductId,
    int Quantity);

public record UpdateOrderStatusRequest(
    string Status);