using InventoryManagement.Api.DTOs.Catalog;
using InventoryManagement.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace InventoryManagement.Api.Controllers;

[ApiController]
[Route("api/categories")]
[Authorize(Roles = "Admin")]
public class CategoriesController : ControllerBase
{
    private readonly CatalogService _catalogService;

    public CategoriesController(
        CatalogService catalogService)
    {
        _catalogService = catalogService;
    }

    // =========================================================
    // GET ALL CATEGORIES
    // =========================================================

    [HttpGet]
    public async Task<IActionResult> GetCategories()
    {
        var categories =
            await _catalogService.GetCategoriesAsync();

        return Ok(categories);
    }

    // =========================================================
    // CREATE CATEGORY
    // =========================================================

    [HttpPost]
    public async Task<IActionResult> CreateCategory(
        CreateCategoryRequest request)
    {
        try
        {
            var category =
                await _catalogService
                    .CreateCategoryAsync(request);

            return Created(
                $"/api/categories/{category.Id}",
                category);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new
            {
                message = ex.Message
            });
        }
        catch (InvalidOperationException ex)
        {
            return Conflict(new
            {
                message = ex.Message
            });
        }
    }
}