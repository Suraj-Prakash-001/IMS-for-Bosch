using InventoryManagement.Api.Data;
using InventoryManagement.Api.DTOs.Locations;
using InventoryManagement.Api.Models.Entities;
using MongoDB.Driver;

namespace InventoryManagement.Api.Services;

public class LocationService
{
    private readonly MongoDbContext _db;

    public LocationService(MongoDbContext db)
    {
        _db = db;
    }

    // =====================================================
    // LOCATION
    // =====================================================

    public async Task<Location> CreateLocationAsync(
        CreateLocationRequest request)
    {
        ValidateText(request.Name, "Location name");
        ValidateText(request.Code, "Location code");

        string code = request.Code.Trim();

        bool exists =
            await _db.Locations
                .Find(x => x.Code == code)
                .AnyAsync();

        if (exists)
        {
            throw new InvalidOperationException(
                $"Location code '{code}' already exists.");
        }

        var location = new Location
        {
            Name = request.Name.Trim(),
            Code = code,
            Address = request.Address?.Trim() ?? string.Empty,
            Description =
                request.Description?.Trim() ?? string.Empty,
            CreatedAt = DateTime.UtcNow
        };

        await _db.Locations.InsertOneAsync(location);

        return location;
    }

    public async Task<List<Location>> GetLocationsAsync()
    {
        return await _db.Locations
            .Find(_ => true)
            .SortBy(x => x.Name)
            .ToListAsync();
    }

    // =====================================================
    // BUILDING
    // =====================================================

    public async Task<Building> CreateBuildingAsync(
        CreateBuildingRequest request)
    {
        ValidateText(request.LocationId, "Location ID");
        ValidateText(request.Name, "Building name");
        ValidateText(request.Code, "Building code");

        bool locationExists =
            await _db.Locations
                .Find(x => x.Id == request.LocationId)
                .AnyAsync();

        if (!locationExists)
        {
            throw new ArgumentException(
                "The specified location does not exist.");
        }

        string code = request.Code.Trim();

        bool duplicate =
            await _db.Buildings
                .Find(x =>
                    x.LocationId == request.LocationId &&
                    x.Code == code)
                .AnyAsync();

        if (duplicate)
        {
            throw new InvalidOperationException(
                $"Building code '{code}' already exists in this location.");
        }

        var building = new Building
        {
            LocationId = request.LocationId,
            Name = request.Name.Trim(),
            Code = code,
            Description =
                request.Description?.Trim() ?? string.Empty,
            CreatedAt = DateTime.UtcNow
        };

        await _db.Buildings.InsertOneAsync(building);

        return building;
    }

    public async Task<List<Building>> GetBuildingsAsync(
        string locationId)
    {
        ValidateText(locationId, "Location ID");

        return await _db.Buildings
            .Find(x => x.LocationId == locationId)
            .SortBy(x => x.Name)
            .ToListAsync();
    }

    // =====================================================
    // FLOOR
    // =====================================================

    public async Task<Floor> CreateFloorAsync(
        CreateFloorRequest request)
    {
        ValidateText(request.BuildingId, "Building ID");
        ValidateText(request.Name, "Floor name");
        ValidateText(request.Code, "Floor code");

        bool buildingExists =
            await _db.Buildings
                .Find(x => x.Id == request.BuildingId)
                .AnyAsync();

        if (!buildingExists)
        {
            throw new ArgumentException(
                "The specified building does not exist.");
        }

        string code = request.Code.Trim();

        bool duplicate =
            await _db.Floors
                .Find(x =>
                    x.BuildingId == request.BuildingId &&
                    (
                        x.Code == code ||
                        x.FloorNumber == request.FloorNumber
                    ))
                .AnyAsync();

        if (duplicate)
        {
            throw new InvalidOperationException(
                "A floor with this code or floor number already exists in the building.");
        }

        var floor = new Floor
        {
            BuildingId = request.BuildingId,
            Name = request.Name.Trim(),
            FloorNumber = request.FloorNumber,
            Code = code,
            CreatedAt = DateTime.UtcNow
        };

        await _db.Floors.InsertOneAsync(floor);

        return floor;
    }

    public async Task<List<Floor>> GetFloorsAsync(
        string buildingId)
    {
        ValidateText(buildingId, "Building ID");

        return await _db.Floors
            .Find(x => x.BuildingId == buildingId)
            .SortBy(x => x.FloorNumber)
            .ToListAsync();
    }

    // =====================================================
    // SECTION
    // =====================================================

    public async Task<Section> CreateSectionAsync(
        CreateSectionRequest request)
    {
        ValidateText(request.FloorId, "Floor ID");
        ValidateText(request.Name, "Section name");
        ValidateText(request.Code, "Section code");

        bool floorExists =
            await _db.Floors
                .Find(x => x.Id == request.FloorId)
                .AnyAsync();

        if (!floorExists)
        {
            throw new ArgumentException(
                "The specified floor does not exist.");
        }

        string code = request.Code.Trim();

        bool duplicate =
            await _db.Sections
                .Find(x =>
                    x.FloorId == request.FloorId &&
                    x.Code == code)
                .AnyAsync();

        if (duplicate)
        {
            throw new InvalidOperationException(
                $"Section code '{code}' already exists on this floor.");
        }

        var section = new Section
        {
            FloorId = request.FloorId,
            Name = request.Name.Trim(),
            Code = code,
            Description =
                request.Description?.Trim() ?? string.Empty,
            CreatedAt = DateTime.UtcNow
        };

        await _db.Sections.InsertOneAsync(section);

        return section;
    }

    public async Task<List<Section>> GetSectionsAsync(
        string floorId)
    {
        ValidateText(floorId, "Floor ID");

        return await _db.Sections
            .Find(x => x.FloorId == floorId)
            .SortBy(x => x.Name)
            .ToListAsync();
    }

    // =====================================================
    // SEAT
    // =====================================================

    public async Task<Seat> CreateSeatAsync(
        CreateSeatRequest request)
    {
        ValidateText(request.SectionId, "Section ID");
        ValidateText(request.RowName, "Row name");
        ValidateText(request.Code, "Seat code");

        if (request.SeatNumber <= 0)
        {
            throw new ArgumentException(
                "Seat number must be greater than zero.");
        }

        bool sectionExists =
            await _db.Sections
                .Find(x => x.Id == request.SectionId)
                .AnyAsync();

        if (!sectionExists)
        {
            throw new ArgumentException(
                "The specified section does not exist.");
        }

        string rowName = request.RowName.Trim();
        string code = request.Code.Trim();

        bool duplicate =
            await _db.Seats
                .Find(x =>
                    x.SectionId == request.SectionId &&
                    (
                        (
                            x.RowName == rowName &&
                            x.SeatNumber == request.SeatNumber
                        ) ||
                        x.Code == code
                    ))
                .AnyAsync();

        if (duplicate)
        {
            throw new InvalidOperationException(
                "A seat with this row/number or code already exists in this section.");
        }

        var seat = new Seat
        {
            SectionId = request.SectionId,
            RowName = rowName,
            SeatNumber = request.SeatNumber,
            Code = code,
            Status = string.IsNullOrWhiteSpace(request.Status)
                ? "Available"
                : request.Status.Trim(),
            CreatedAt = DateTime.UtcNow
        };

        await _db.Seats.InsertOneAsync(seat);

        return seat;
    }

    public async Task<List<Seat>> GetSeatsAsync(
        string sectionId)
    {
        ValidateText(sectionId, "Section ID");

        return await _db.Seats
            .Find(x => x.SectionId == sectionId)
            .SortBy(x => x.RowName)
            .ThenBy(x => x.SeatNumber)
            .ToListAsync();
    }

    // =====================================================
    // VALIDATION
    // =====================================================

    private static void ValidateText(
        string? value,
        string fieldName)
    {
        if (string.IsNullOrWhiteSpace(value))
        {
            throw new ArgumentException(
                $"{fieldName} is required.");
        }
    }
}