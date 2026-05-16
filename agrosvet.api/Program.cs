using Agrosvet.Api.Endpoints;
using Agrosvet.Api.Repositories;
using Agrosvet.Api.Services;

var builder = WebApplication.CreateBuilder(args);

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

// Register the repositories and services for dependency injection
builder.Services.AddSingleton<IProductRepository, ProductRepository>();
builder.Services.AddScoped<IProductService, ProductService>();
builder.Services.AddSingleton<ICategoryRepository, CategoryRepository>();
builder.Services.AddScoped<ICategoryService, CategoryService>();
builder.Services.AddSingleton<ICartRepository, CartRepository>();
builder.Services.AddScoped<ICartService, CartService>();

var app = builder.Build();

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

app.Run();
