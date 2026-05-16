using Agrosvet.Api.Models;
using Agrosvet.Api.Services;

namespace Agrosvet.Api.Endpoints;

public static class ProductEndpoints
{
    public static void MapProductEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/products");

        group.MapGet("/", (IProductService productService) => 
            Results.Ok(productService.GetAllProducts()))
        .WithName("GetProducts");

        group.MapGet("/{id}", (int id, IProductService productService) =>
        {
            var product = productService.GetProductById(id);
            return product is not null ? Results.Ok(product) : Results.NotFound();
        })
        .WithName("GetProductById");

        group.MapGet("/category/{categoryId}", (int categoryId, IProductService productService) => 
            Results.Ok(productService.GetProductsByCategory(categoryId)))
        .WithName("GetProductsByCategory");

        group.MapPost("/", (Product product, IProductService productService) =>
        {
            var createdProduct = productService.CreateProduct(product);
            return Results.Created($"/products/{createdProduct.Id}", createdProduct);
        })
        .WithName("CreateProduct");

        group.MapPut("/{id}", (int id, Product product, IProductService productService) =>
        {
            if (id != product.Id) return Results.BadRequest();
            var success = productService.UpdateProduct(product);
            return success ? Results.NoContent() : Results.NotFound();
        })
        .WithName("UpdateProduct");

        group.MapDelete("/{id}", (int id, IProductService productService) =>
        {
            var success = productService.DeleteProduct(id);
            return success ? Results.NoContent() : Results.NotFound();
        })
        .WithName("DeleteProduct");
    }
}
