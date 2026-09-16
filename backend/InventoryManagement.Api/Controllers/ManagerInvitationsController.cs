using InventoryManagement.Api.DTOs.Auth;
using InventoryManagement.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace InventoryManagement.Api.Controllers;

[ApiController]
[Route("api/manager-invitations")]
[Authorize(Roles = "Admin")]
public class ManagerInvitationsController : ControllerBase
{
    private readonly ManagerInvitationService _invitationService;

    public ManagerInvitationsController(
        ManagerInvitationService invitationService)
    {
        _invitationService = invitationService;
    }

    [HttpPost]
    public async Task<IActionResult> CreateInvitation(
        CreateManagerInvitationRequest request)
    {
        try
        {
            var result =
                await _invitationService.CreateInvitationAsync(
                    request.DepartmentId);

            return Ok(
                new ManagerInvitationResponse(
                    result.RegistrationUrl,
                    result.Invitation.DepartmentId,
                    result.Invitation.ExpiresAt));
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