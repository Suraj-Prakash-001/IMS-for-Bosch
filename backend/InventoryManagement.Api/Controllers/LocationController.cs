using InventoryManagement.Api.DTOs.Locations;
using InventoryManagement.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace InventoryManagement.Api.Controllers;

[ApiController]
[Route("api/locations")]
[Authorize(Roles = "Admin")]
public class LocationController : ControllerBase
{
    private readonly LocationService _locationService;

    public LocationController(LocationService locationService)
    {
        _locationService = locationService;
    }

    [HttpGet]
    public async Task<IActionResult> GetLocations()
    {
        var locations = await _locationService.GetLocationsAsync();
        return Ok(locations);
    }

    [HttpPost]
    public async Task<IActionResult> CreateLocation(
        [FromBody] CreateLocationRequest request)
    {
        try
        {
            var location =
                await _locationService.CreateLocationAsync(request);

            return Created(
                $"/api/locations/{location.Id}",
                location);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
        catch (InvalidOperationException ex)
        {
            return Conflict(new { message = ex.Message });
        }
    }

    [HttpGet("{locationId}/buildings")]
    public async Task<IActionResult> GetBuildings(string locationId)
    {
        try
        {
            var buildings =
                await _locationService.GetBuildingsAsync(locationId);

            return Ok(buildings);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPost("{locationId}/buildings")]
    public async Task<IActionResult> CreateBuilding(
        string locationId,
        [FromBody] CreateBuildingRequest request)
    {
        try
        {
            var building = await _locationService.CreateBuildingAsync(
                locationId,
                request);

            return Created(
                $"/api/locations/{locationId}/buildings/{building.Id}",
                building);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
        catch (InvalidOperationException ex)
        {
            return Conflict(new { message = ex.Message });
        }
    }

    [HttpGet("buildings/{buildingId}/floors")]
    public async Task<IActionResult> GetFloors(string buildingId)
    {
        try
        {
            var floors =
                await _locationService.GetFloorsAsync(buildingId);

            return Ok(floors);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPost("buildings/{buildingId}/floors")]
public async Task<IActionResult> CreateFloor(
    string buildingId,
    [FromBody] CreateFloorRequest request)
{
    try
    {
        var floor = await _locationService.CreateFloorAsync(
            buildingId,
            request);

        return Created(
            $"/api/locations/buildings/{buildingId}/floors/{floor.Id}",
            floor);
    }
    catch (ArgumentException ex)
    {
        return BadRequest(new { message = ex.Message });
    }
    catch (InvalidOperationException ex)
    {
        return Conflict(new { message = ex.Message });
    }
}

[HttpGet("floors/{floorId}/sections")]
public async Task<IActionResult> GetSections(string floorId)
{
    try
    {
        var sections =
            await _locationService.GetSectionsAsync(floorId);

        return Ok(sections);
    }
    catch (ArgumentException ex)
    {
        return BadRequest(new { message = ex.Message });
    }
}

[HttpPost("floors/{floorId}/sections")]
public async Task<IActionResult> CreateSection(
    string floorId,
    [FromBody] CreateSectionRequest request)
{
    try
    {
        var sectionRequest = request with
        {
            FloorId = floorId
        };

        var section =
            await _locationService.CreateSectionAsync(sectionRequest);

        return Created(
            $"/api/locations/floors/{floorId}/sections/{section.Id}",
            section);
    }
    catch (ArgumentException ex)
    {
        return BadRequest(new { message = ex.Message });
    }
    catch (InvalidOperationException ex)
    {
        return Conflict(new { message = ex.Message });
    }
}
}