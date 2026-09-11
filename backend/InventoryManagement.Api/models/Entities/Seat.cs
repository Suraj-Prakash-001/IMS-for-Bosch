using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace InventoryManagement.Api.Models.Entities;

public class Seat
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string Id { get; set; } = string.Empty;

    [BsonElement("sectionId")]
    [BsonRepresentation(BsonType.ObjectId)]
    public string SectionId { get; set; } = string.Empty;

    public string RowName { get; set; } = string.Empty;

    public int SeatNumber { get; set; }

    public string Code { get; set; } = string.Empty;

    public string Status { get; set; } = "Available";

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}