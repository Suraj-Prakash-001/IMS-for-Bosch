using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace InventoryManagement.Api.Models.Entities;

public class Floor
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string Id { get; set; } = string.Empty;

    [BsonElement("buildingId")]
    [BsonRepresentation(BsonType.ObjectId)]
    public string BuildingId { get; set; } = string.Empty;

    public string Name { get; set; } = string.Empty;

    public int FloorNumber { get; set; }

    public string Code { get; set; } = string.Empty;

    public string MapImageUrl { get; set; } = string.Empty;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}