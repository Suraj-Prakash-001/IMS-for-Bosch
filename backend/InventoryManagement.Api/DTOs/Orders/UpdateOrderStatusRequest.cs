using InventoryManagement.Api.Models.Enums;

namespace InventoryManagement.Api.DTOs.Orders;

public class UpdateOrderStatusRequest
{
    public OrderStatus Status { get; set; }
}