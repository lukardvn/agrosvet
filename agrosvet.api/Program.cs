using System.Text.Json.Serialization;
using Agrosvet.Api.Data;
using Agrosvet.Api.Endpoints;
using Agrosvet.Api.Repositories;
using Agrosvet.Api.Services;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Prevent circular reference issues from EF Core navigation properties
builder.Services.ConfigureHttpJsonOptions(options =>
{
    options.SerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
    options.SerializerOptions.DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull;
});

// Add CORS to allow the frontend to talk to the API
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

// Add services to the container.
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Configure PostgreSQL with EF Core
// Railway provides DATABASE_URL; for local dev, use appsettings.json ConnectionStrings:DefaultConnection
var databaseUrl = Environment.GetEnvironmentVariable("DATABASE_URL");
var connectionString = !string.IsNullOrEmpty(databaseUrl)
    ? ConvertDatabaseUrl(databaseUrl)
    : builder.Configuration.GetConnectionString("DefaultConnection");

builder.Services.AddDbContext<AgrosvetDbContext>(options =>
    options.UseNpgsql(connectionString));

// Register the repositories and services for dependency injection
builder.Services.AddScoped<IProductRepository, ProductRepository>();
builder.Services.AddScoped<IProductService, ProductService>();
builder.Services.AddScoped<ICategoryRepository, CategoryRepository>();
builder.Services.AddScoped<ICategoryService, CategoryService>();
builder.Services.AddScoped<ICartRepository, CartRepository>();
builder.Services.AddScoped<ICartService, CartService>();
builder.Services.AddScoped<IProductImageRepository, ProductImageRepository>();
builder.Services.AddScoped<IProductImageService, ProductImageService>();

var app = builder.Build();

// Auto-apply migrations on startup
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AgrosvetDbContext>();
    db.Database.Migrate();
}

// Configure the HTTP request pipeline.
// Temporarily removed IsDevelopment check to ensure Swagger is accessible
app.UseSwagger();
app.UseSwaggerUI(options =>
{
    options.SwaggerEndpoint("/swagger/v1/swagger.json", "v1");
    options.RoutePrefix = "swagger"; 
});

app.UseHttpsRedirection();
app.UseCors("AllowAll"); // Enable CORS

// Map feature-specific endpoints
app.MapProductEndpoints();
app.MapCategoryEndpoints();
app.MapCartEndpoints();
app.MapProductImageEndpoints();

app.Run();

// Helper: Convert Railway's DATABASE_URL (postgresql://user:pass@host:port/db) to Npgsql connection string
static string ConvertDatabaseUrl(string databaseUrl)
{
    var uri = new Uri(databaseUrl);
    var userInfo = uri.UserInfo.Split(':');
    return $"Host={uri.Host};Port={uri.Port};Database={uri.AbsolutePath.TrimStart('/')};Username={userInfo[0]};Password={userInfo[1]};SSL Mode=Require;Trust Server Certificate=true";
}
