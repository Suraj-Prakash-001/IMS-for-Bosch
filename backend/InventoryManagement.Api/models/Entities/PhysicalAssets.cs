using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace InventoryManagement.Api.Models.Entities;

public class PhysicalAsset
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string Id { get; set; } = string.Empty;

    /// <summary>
    /// The catalog product this physical asset represents.
    /// Example: Dell Latitude 5550.
    /// </summary>
    [BsonElement("productId")]
    [BsonRepresentation(BsonType.ObjectId)]
    public string ProductId { get; set; } = string.Empty;

    /// <summary>
    /// Unique company asset identifier.
    /// Example: LAP-000123.
    /// </summary>
    public string AssetTag { get; set; } = string.Empty;

    /// <summary>
    /// Manufacturer serial number, when applicable.
    /// </summary>
    public string SerialNumber { get; set; } = string.Empty;

    /// <summary>
    /// Current physical seat/location of the asset.
    /// Nullable because some assets may temporarily be in storage,
    /// maintenance, transit, etc.
    /// </summary>
    [BsonElement("seatId")]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? SeatId { get; set; }

    /// <summary>
    /// Current condition of the physical asset.
    /// Examples: New, Good, Fair, Damaged.
    /// </summary>
    public string Condition { get; set; } = "Good";

    /// <summary>
    /// Current operational state of the asset.
    /// Examples: Available, Assigned, Maintenance, Lost, Disposed.
    /// </summary>
    public string Status { get; set; } = "Available";

    /// <summary>
    /// Optional employee/user assigned to the physical asset.
    /// We are keeping this nullable for now.
    /// </summary>
    [BsonElement("assignedToUserId")]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? AssignedToUserId { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}