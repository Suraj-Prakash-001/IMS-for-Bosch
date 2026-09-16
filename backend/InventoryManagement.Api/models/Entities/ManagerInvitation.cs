using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace InventoryManagement.Api.Models.Entities;

public class ManagerInvitation
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string Id { get; set; } = string.Empty;

    public string Token { get; set; } = string.Empty;

    public string DepartmentId { get; set; } = string.Empty;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime ExpiresAt { get; set; }

    public bool Used { get; set; } = false;

    public DateTime? UsedAt { get; set; }
}