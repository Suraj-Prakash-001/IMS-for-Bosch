namespace InventoryManagement.Api.Models.Enums;

public enum OrderStatus
{
    Submitted,
    PendingManagerApproval,
    RejectedByManager,
    PendingAdminProcessing,
    InProgress,
    Completed
}