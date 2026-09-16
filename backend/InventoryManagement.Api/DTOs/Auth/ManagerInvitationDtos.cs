namespace InventoryManagement.Api.DTOs.Auth;

public record CreateManagerInvitationRequest(
    string DepartmentId);

public record ManagerInvitationResponse(
    string RegistrationUrl,
    string DepartmentId,
    DateTime ExpiresAt);