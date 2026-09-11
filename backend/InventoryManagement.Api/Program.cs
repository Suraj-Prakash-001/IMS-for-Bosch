using InventoryManagement.Api.Data;
using InventoryManagement.Api.Services;

var builder = WebApplication.CreateBuilder(args);

// MongoDB configuration
var mongoSettings =
    builder.Configuration
        .GetSection("MongoDb")
        .Get<MongoDbSettings>()
    ?? throw new InvalidOperationException(
        "MongoDb configuration is missing.");

builder.Services.AddSingleton(mongoSettings);
builder.Services.AddSingleton<MongoDbContext>();

// Application services
builder.Services.AddScoped<PasswordHasher>();
builder.Services.AddScoped<TokenService>();
builder.Services.AddScoped<AuthService>();
builder.Services.AddScoped<LocationService>();
builder.Services.AddScoped<CatalogService>();
builder.Services.AddScoped<OrderService>();

// Controllers
builder.Services.AddControllers();

// Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.MapControllers();

app.Run();
