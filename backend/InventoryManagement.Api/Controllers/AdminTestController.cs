using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace InventoryManagement.Api.Controllers;

[ApiController]
[Route("api/admin-test")]
[Authorize(Roles = "Admin")]
public class AdminTestController : ControllerBase
{
    [HttpGet]
    public IActionResult Test()
    {
        return Ok(new
        {
            message = "Admin authorization is working.",
            username = User.Identity?.Name,
            role = User.FindFirst(
                "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
            )?.Value
        });
    }
}