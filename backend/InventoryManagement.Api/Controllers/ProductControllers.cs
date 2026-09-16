using InventoryManagement.Api.DTOs.Catalog;
using InventoryManagement.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace InventoryManagement.Api.Controllers;

[ApiController]
[Route("api/products")]
public class ProductControllers : ControllerBase
{
    private readonly CatalogService _catalogService;

    public ProductControllers(
        CatalogService catalogService)
    {
        _catalogService = catalogService;
    }

    // =========================================================
    // GET ALL PRODUCTS
    // Publicly accessible
    // =========================================================

    [HttpGet]
    [AllowAnonymous]
    public async Task<IActionResult> GetProducts(
        [FromQuery] string? categoryId = null)
    {
        var products =
            await _catalogService
                .GetProductsAsync(categoryId);

        return Ok(products);
    }

    // =========================================================
    // GET PRODUCT BY ID
    // Publicly accessible
    // =========================================================

    [HttpGet("{id}")]
    [AllowAnonymous]
    public async Task<IActionResult> GetProduct(
        string id)
    {
        try
        {
            var product =
                await _catalogService
                    .GetProductByIdAsync(id);

            if (product == null)
            {
                return NotFound(new
                {
                    message = "Product not found."
                });
            }

            return Ok(product);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new
            {
                message = ex.Message
            });
        }
    }

    // =========================================================
    // CREATE PRODUCT
    // Admin only
    // =========================================================

    [HttpPost]
[Authorize(Roles = "Admin")]
[Consumes("multipart/form-data")]
public async Task<IActionResult> CreateProduct(
    [FromForm] CreateProductRequest request)
{
    try
    {
        var product =
            await _catalogService
                .CreateProductAsync(
                    request.CategoryId,
                    request.Name,
                    request.Sku,
                    request.Description,
                    request.Price,
                    request.StockQuantity,
                    request.Image);

        return Created(
            $"/api/products/{product.Id}",
            product);
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

    // =========================================================
    // UPDATE STOCK
    // Admin only
    // =========================================================

    [HttpPut("{id}/stock")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> UpdateStock(
        string id,
        [FromBody] UpdateStockRequest request)
    {
        try
        {
            var product =
                await _catalogService
                    .UpdateStockAsync(
                        id,
                        request.Quantity);

            if (product == null)
            {
                return NotFound(new
                {
                    message =
                        "Product not found or inactive."
                });
            }

            return Ok(product);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new
            {
                message = ex.Message
            });
        }
    }
}