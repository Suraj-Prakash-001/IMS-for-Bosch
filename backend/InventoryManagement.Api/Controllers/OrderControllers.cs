using System.Security.Claims;
using InventoryManagement.Api.DTOs.Orders;
using InventoryManagement.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace InventoryManagement.Api.Controllers;

[ApiController]
[Route("api/orders")]
[Authorize]
public class OrderControllers : ControllerBase
{
    private readonly OrderService _orderService;

    public OrderControllers(OrderService orderService)
    {
        _orderService = orderService;
    }

    // =========================================================
    // CUSTOMER: CREATE ORDER
    // =========================================================

    [HttpPost]
    [Authorize(Roles = "Customer,Manager")]
    public async Task<IActionResult> CreateOrder(
        CreateOrderRequest request)
    {
        var userId =
            User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        var username =
            User.FindFirst(ClaimTypes.Name)?.Value;

        var departmentId =
            User.FindFirst("DepartmentId")?.Value;

        if (string.IsNullOrWhiteSpace(userId))
        {
            return Unauthorized(new
            {
                message = "User identity could not be determined."
            });
        }

        if (string.IsNullOrWhiteSpace(username))
        {
            return Unauthorized(new
            {
                message = "Username could not be determined."
            });
        }

        if (string.IsNullOrWhiteSpace(departmentId))
        {
            return BadRequest(new
            {
                message =
                    "Your account does not have a department assigned."
            });
        }

        try
        {
            var order =
                await _orderService.CreateOrderAsync(
                    userId,
                    username,
                    departmentId,
                    request);

            return Created(
                $"/api/orders/{order.Id}",
                order);
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
    // CUSTOMER: VIEW OWN ORDERS
    // =========================================================

    [HttpGet("mine")]
    [Authorize(Roles = "Customer,Manager")]
    public async Task<IActionResult> GetMyOrders()
    {
        var userId =
            User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        if (string.IsNullOrWhiteSpace(userId))
        {
            return Unauthorized(new
            {
                message = "User identity could not be determined."
            });
        }

        var orders =
            await _orderService
                .GetCustomerOrdersAsync(userId);

        return Ok(orders);
    }

    // =========================================================
    // MANAGER: GET PENDING APPROVALS
    // =========================================================

    [HttpGet("manager/pending")]
    [Authorize(Roles = "Manager")]
    public async Task<IActionResult> GetManagerPendingOrders()
    {
        var departmentId =
            User.FindFirst("DepartmentId")?.Value;

        if (string.IsNullOrWhiteSpace(departmentId))
        {
            return Forbid();
        }

        var orders =
            await _orderService
                .GetManagerPendingOrdersAsync(departmentId);

        return Ok(orders);
    }

    // =========================================================
    // MANAGER: APPROVE ORDER
    // =========================================================

    [HttpPost("manager/{orderId}/approve")]
    [Authorize(Roles = "Manager")]
    public async Task<IActionResult> ApproveOrder(
        string orderId)
    {
        var departmentId =
            User.FindFirst("DepartmentId")?.Value;

        if (string.IsNullOrWhiteSpace(departmentId))
        {
            return Forbid();
        }

        var order =
            await _orderService
                .ApproveByManagerAsync(
                    orderId,
                    departmentId);

        if (order == null)
        {
            return NotFound(new
            {
                message =
                    "Order was not found, does not belong to your department, or has already been processed."
            });
        }

        return Ok(order);
    }

    // =========================================================
    // MANAGER: REJECT ORDER
    // =========================================================

    [HttpPost("manager/{orderId}/reject")]
    [Authorize(Roles = "Manager")]
    public async Task<IActionResult> RejectOrder(
        string orderId,
        RejectOrderRequest request)
    {
        var departmentId =
            User.FindFirst("DepartmentId")?.Value;

        if (string.IsNullOrWhiteSpace(departmentId))
        {
            return Forbid();
        }

        try
        {
            var order =
                await _orderService
                    .RejectByManagerAsync(
                        orderId,
                        departmentId,
                        request.Comment);

            if (order == null)
            {
                return NotFound(new
                {
                    message =
                        "Order was not found, does not belong to your department, or has already been processed."
                });
            }

            return Ok(order);
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