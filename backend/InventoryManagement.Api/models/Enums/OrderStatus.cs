namespace InventoryManagement.Api.Models.Enums;

public enum OrderStatus
{
    PendingManagerApproval = 0,
    PendingAdminProcessing = 1,
    RejectedByManager = 2,
    InProgress = 3,
    Completed = 4
}