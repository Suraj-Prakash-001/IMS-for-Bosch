namespace InventoryManagement.Api.DTOs.Locations;

public record CreateLocationRequest(
    string Name,
    string Code,
    string? Address,
    string? Description);

public record CreateBuildingRequest(
    string LocationId,
    string Name,
    string Code,
    string? Description);

public record CreateFloorRequest(
    string BuildingId,
    string Name,
    int FloorNumber,
    string Code);

public record CreateSectionRequest(
    string FloorId,
    string Name,
    string Code,
    string? Description);

public record CreateSeatRequest(
    string SectionId,
    string RowName,
    int SeatNumber,
    string Code,
    string Status);