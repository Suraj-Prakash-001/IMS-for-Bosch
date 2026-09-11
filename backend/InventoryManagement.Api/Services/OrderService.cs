using InventoryManagement.Api.Data;
using InventoryManagement.Api.DTOs.Orders;
using InventoryManagement.Api.Models.Entities;
using InventoryManagement.Api.Models.Enums;
using MongoDB.Driver;

namespace InventoryManagement.Api.Services;

public class OrderService
{
    private readonly MongoDbContext _db;

    public OrderService(MongoDbContext db)
    {
        _db = db;
    }

    // =====================================================
    // CREATE ORDER
    // =====================================================

    public async Task<Order> CreateOrderAsync(
        string customerId,
        string customerName,
        CreateOrderRequest request)
    {
        if (string.IsNullOrWhiteSpace(customerId))
        {
            throw new ArgumentException(
                "Customer ID is required.");
        }

        if (string.IsNullOrWhiteSpace(customerName))
        {
            throw new ArgumentException(
                "Customer name is required.");
        }

        if (request.Items == null ||
            request.Items.Count == 0)
        {
            throw new ArgumentException(
                "An order must contain at least one product.");
        }

        var orderItems = new List<OrderItem>();

        /*
         * Keep track of stock reservations made during this
         * operation so they can be rolled back if creating
         * the order itself fails.
         */
        var reservedStock =
            new List<(string ProductId, int Quantity)>();

        try
        {
            /*
             * Combine duplicate product IDs.
             *
             * Example:
             *
             * Product A x 2
             * Product A x 3
             *
             * becomes:
             *
             * Product A x 5
             */
            var requestedItems =
                request.Items
                    .GroupBy(x => x.ProductId)
                    .Select(group => new
                    {
                        ProductId = group.Key,
                        Quantity = group.Sum(x => x.Quantity)
                    })
                    .ToList();

            foreach (var requestedItem in requestedItems)
            {
                if (string.IsNullOrWhiteSpace(
                        requestedItem.ProductId))
                {
                    throw new ArgumentException(
                        "Product ID is required.");
                }

                if (requestedItem.Quantity <= 0)
                {
                    throw new ArgumentException(
                        "Product quantity must be greater than zero.");
                }

                var product =
                    await _db.Products
                        .Find(x =>
                            x.Id == requestedItem.ProductId &&
                            x.IsActive)
                        .FirstOrDefaultAsync();

                if (product == null)
                {
                    throw new ArgumentException(
                        $"Product '{requestedItem.ProductId}' was not found.");
                }

                /*
                 * Atomic stock check + decrement.
                 *
                 * The database only updates the document when
                 * enough stock is available.
                 */
                var stockFilter =
                    Builders<Product>.Filter.And(
                        Builders<Product>.Filter.Eq(
                            x => x.Id,
                            product.Id),

                        Builders<Product>.Filter.Eq(
                            x => x.IsActive,
                            true),

                        Builders<Product>.Filter.Gte(
                            x => x.StockQuantity,
                            requestedItem.Quantity)
                    );

                var stockUpdate =
                    Builders<Product>.Update
                        .Inc(
                            x => x.StockQuantity,
                            -requestedItem.Quantity)
                        .Set(
                            x => x.UpdatedAt,
                            DateTime.UtcNow);

                var result =
                    await _db.Products.UpdateOneAsync(
                        stockFilter,
                        stockUpdate);

                if (result.ModifiedCount == 0)
                {
                    throw new InvalidOperationException(
                        $"Insufficient stock for '{product.Name}'.");
                }

                reservedStock.Add(
                    (
                        product.Id,
                        requestedItem.Quantity
                    ));

                orderItems.Add(
                    new OrderItem
                    {
                        ProductId = product.Id,
                        ProductName = product.Name,
                        UnitPrice = product.Price,
                        Quantity =
                            requestedItem.Quantity,
                        Subtotal =
                            product.Price *
                            requestedItem.Quantity
                    });
            }

            decimal total =
                orderItems.Sum(
                    item => item.Subtotal);

            var order = new Order
            {
                CustomerId = customerId,
                CustomerName = customerName.Trim(),
                Items = orderItems,
                TotalAmount = total,
                Status = OrderStatus.Submitted,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            await _db.Orders.InsertOneAsync(order);

            return order;
        }
        catch
        {
            /*
             * Roll back reserved stock if anything failed.
             */
            foreach (var reservation in reservedStock)
            {
                var rollback =
                    Builders<Product>.Update
                        .Inc(
                            x => x.StockQuantity,
                            reservation.Quantity)
                        .Set(
                            x => x.UpdatedAt,
                            DateTime.UtcNow);

                await _db.Products.UpdateOneAsync(
                    x => x.Id == reservation.ProductId,
                    rollback);
            }

            throw;
        }
    }

    // =====================================================
    // CUSTOMER ORDERS
    // =====================================================

    public async Task<List<Order>> GetCustomerOrdersAsync(
        string customerId)
    {
        if (string.IsNullOrWhiteSpace(customerId))
        {
            throw new ArgumentException(
                "Customer ID is required.");
        }

        return await _db.Orders
            .Find(x => x.CustomerId == customerId)
            .SortByDescending(x => x.CreatedAt)
            .ToListAsync();
    }

    // =====================================================
    // ADMIN ORDERS
    // =====================================================

    public async Task<List<Order>> GetAllOrdersAsync()
    {
        return await _db.Orders
            .Find(_ => true)
            .SortByDescending(x => x.CreatedAt)
            .ToListAsync();
    }

    // =====================================================
    // ORDER STATUS
    // =====================================================

    public async Task<Order?> UpdateStatusAsync(
        string orderId,
        OrderStatus newStatus)
    {
        if (string.IsNullOrWhiteSpace(orderId))
        {
            throw new ArgumentException(
                "Order ID is required.");
        }

        var update =
            Builders<Order>.Update
                .Set(
                    x => x.Status,
                    newStatus)
                .Set(
                    x => x.UpdatedAt,
                    DateTime.UtcNow);

        return await _db.Orders
            .FindOneAndUpdateAsync(
                x => x.Id == orderId,
                update,
                new FindOneAndUpdateOptions<Order>
                {
                    ReturnDocument =
                        ReturnDocument.After
                });
    }
}