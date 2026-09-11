namespace InventoryManagement.Api.DTOs.Catalog;

public record CreatePhysicalAssetRequest(
    string ProductId,
    string AssetTag,
    string SerialNumber,
    string? SeatId,
    string Condition,
    string Status,
    string? AssignedToUserId
);

public record UpdatePhysicalAssetRequest(
    string? SeatId,
    string Condition,
    string Status,
    string? AssignedToUserId
);