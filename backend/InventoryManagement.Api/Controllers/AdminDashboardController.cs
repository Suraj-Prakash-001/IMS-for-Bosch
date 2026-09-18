using InventoryManagement.Api.Data;
using InventoryManagement.Api.Models.Enums;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;

namespace InventoryManagement.Api.Controllers;

[ApiController]
[Route("api/admin/dashboard")]
[Authorize(Roles = "Admin")]
public class AdminDashboardController : ControllerBase
{
    private readonly MongoDbContext _db;

    public AdminDashboardController(MongoDbContext db)
    {
        _db = db;
    }

    [HttpGet]
    public async Task<IActionResult> GetDashboard()
    {
        // =====================================================
        // PRODUCT / INVENTORY STATISTICS
        // =====================================================

        var activeProductsFilter =
            Builders<Models.Entities.Product>.Filter.Eq(
                x => x.IsActive,
                true);

        var totalProductsTask =
            _db.Products.CountDocumentsAsync(
                activeProductsFilter);

        // Products with 5 or fewer units are considered low stock.
        var lowStockProductsTask =
            _db.Products.CountDocumentsAsync(
                Builders<Models.Entities.Product>.Filter.And(
                    activeProductsFilter,
                    Builders<Models.Entities.Product>.Filter.Lte(
                        x => x.StockQuantity,
                        5)));

        var totalStockUnitsTask =
            _db.Products
                .Aggregate()
                .Match(activeProductsFilter)
                .Group(
                    x => 1,
                    g => new
                    {
                        Total = g.Sum(x => x.StockQuantity)
                    })
                .FirstOrDefaultAsync();

        // =====================================================
        // ORDER STATISTICS
        // =====================================================

        var totalOrdersTask =
            _db.Orders.CountDocumentsAsync(
                Builders<Models.Entities.Order>.Filter.Empty);

        var pendingManagerTask =
            _db.Orders.CountDocumentsAsync(
                x => x.Status ==
                     OrderStatus.PendingManagerApproval);

        var pendingAdminTask =
            _db.Orders.CountDocumentsAsync(
                x => x.Status ==
                     OrderStatus.PendingAdminProcessing);

        var inProgressTask =
            _db.Orders.CountDocumentsAsync(
                x => x.Status ==
                     OrderStatus.InProgress);

        var completedTask =
            _db.Orders.CountDocumentsAsync(
                x => x.Status ==
                     OrderStatus.Completed);

        var rejectedTask =
            _db.Orders.CountDocumentsAsync(
                x => x.Status ==
                     OrderStatus.RejectedByManager);

        // =====================================================
        // LOCATION STATISTICS
        // =====================================================

        var locations =
            await _db.Locations
                .Find(_ => true)
                .SortBy(x => x.Name)
                .ToListAsync();

        var totalBuildingsTask =
            _db.Buildings.CountDocumentsAsync(
                Builders<Models.Entities.Building>.Filter.Empty);

        var totalFloorsTask =
            _db.Floors.CountDocumentsAsync(
                Builders<Models.Entities.Floor>.Filter.Empty);

        await Task.WhenAll(
            totalProductsTask,
            lowStockProductsTask,
            totalStockUnitsTask,
            totalOrdersTask,
            pendingManagerTask,
            pendingAdminTask,
            inProgressTask,
            completedTask,
            rejectedTask,
            totalBuildingsTask,
            totalFloorsTask);

        // =====================================================
        // CAMPUS OVERVIEW
        // =====================================================

        var campusOverview = new List<object>();

        foreach (var location in locations)
        {
            var buildings =
                await _db.Buildings
                    .Find(x => x.LocationId == location.Id)
                    .ToListAsync();

            var buildingIds =
                buildings
                    .Select(x => x.Id)
                    .ToList();

            long floorCount = 0;

            if (buildingIds.Count > 0)
            {
                floorCount =
                    await _db.Floors.CountDocumentsAsync(
                        x => buildingIds.Contains(
                            x.BuildingId));
            }

            campusOverview.Add(new
            {
                id = location.Id,
                name = location.Name,
                code = location.Code,
                buildingCount = buildings.Count,
                floorCount
            });
        }

        // =====================================================
        // RESPONSE
        // =====================================================

        return Ok(new
        {
            products = new
            {
                total = totalProductsTask.Result,
                lowStock = lowStockProductsTask.Result,
                totalStockUnits =
                    totalStockUnitsTask.Result?.Total ?? 0
            },

            orders = new
            {
                total = totalOrdersTask.Result,

                pendingManagerApproval =
                    pendingManagerTask.Result,

                pendingAdminProcessing =
                    pendingAdminTask.Result,

                inProgress =
                    inProgressTask.Result,

                completed =
                    completedTask.Result,

                rejected =
                    rejectedTask.Result
            },

            locations = new
            {
                total = locations.Count,
                buildings = totalBuildingsTask.Result,
                floors = totalFloorsTask.Result,
                campuses = campusOverview
            }
        });
    }
}