using Agrosvet.Api.Contracts;
using Agrosvet.Api.Models;
using Agrosvet.Api.Services;
using Microsoft.AspNetCore.Mvc;

namespace Agrosvet.Api.Endpoints;

public static class ProductEndpoints
{
    private const long MaxImageSize = 10 * 1024 * 1024;
    private static readonly HashSet<string> AllowedImageTypes =
    [
        "image/jpeg",
        "image/png",
        "image/webp",
        "image/avif"
    ];

    public static void MapProductEndpoints(this IEndpointRouteBuilder app)
    {
        var publicGroup = app.MapGroup("/products");
        var adminGroup = app.MapGroup("/admin/products");

        publicGroup.MapGet("/", (IProductService productService) =>
            Results.Ok(productService.GetActiveProducts().Select(product => product.ToDto())))
        .WithName("GetProducts");

        publicGroup.MapGet("/{id}", (int id, IProductService productService) =>
        {
            var product = productService.GetActiveProductById(id);
            return product is not null ? Results.Ok(product.ToDto()) : Results.NotFound();
        })
        .WithName("GetProductById");

        publicGroup.MapGet("/category/{categoryId}", (int categoryId, IProductService productService) =>
            Results.Ok(productService.GetActiveProductsByCategory(categoryId).Select(product => product.ToDto())))
        .WithName("GetProductsByCategory");

        adminGroup.MapGet("/", (IProductService productService) =>
            Results.Ok(productService.GetAllProducts().Select(product => product.ToDto())))
        .WithName("GetAdminProducts");

        adminGroup.MapGet("/{id}", (int id, IProductService productService) =>
        {
            var product = productService.GetProductById(id);
            return product is not null ? Results.Ok(product.ToDto()) : Results.NotFound();
        })
        .WithName("GetAdminProductById");

        adminGroup.MapPost("/", async (
            [FromForm] ProductUpsertRequest request,
            IProductService productService,
            ICategoryService categoryService,
            CancellationToken cancellationToken) =>
        {
            var errors = Validate(request, categoryService);
            if (errors.Count > 0) return Results.ValidationProblem(errors);

            var product = ToProduct(request);
            var createdProduct = await productService.CreateProductAsync(
                product,
                request.Image,
                cancellationToken);
            return Results.Created($"/admin/products/{createdProduct.Id}", createdProduct.ToDto());
        })
        .DisableAntiforgery()
        .WithName("CreateProduct");

        adminGroup.MapPut("/{id}", async (
            int id,
            [FromForm] ProductUpsertRequest request,
            IProductService productService,
            ICategoryService categoryService,
            CancellationToken cancellationToken) =>
        {
            var errors = Validate(request, categoryService);
            if (errors.Count > 0) return Results.ValidationProblem(errors);

            var updatedProduct = await productService.UpdateProductAsync(
                id,
                ToProduct(request),
                request.Image,
                cancellationToken);
            return updatedProduct is not null
                ? Results.Ok(updatedProduct.ToDto())
                : Results.NotFound();
        })
        .DisableAntiforgery()
        .WithName("UpdateProduct");

        adminGroup.MapDelete("/{id}", async (
            int id,
            IProductService productService,
            CancellationToken cancellationToken) =>
        {
            var success = await productService.DeleteProductAsync(id, cancellationToken);
            return success ? Results.NoContent() : Results.NotFound();
        })
        .WithName("DeleteProduct");
    }

    private static Product ToProduct(ProductUpsertRequest request) => new()
    {
        Name = request.Name.Trim(),
        Description = request.Description.Trim(),
        Price = request.Price,
        CategoryId = request.CategoryId,
        Status = request.Status.Equals("inactive", StringComparison.OrdinalIgnoreCase)
            ? ProductStatus.Inactive
            : ProductStatus.Active
    };

    private static Dictionary<string, string[]> Validate(
        ProductUpsertRequest request,
        ICategoryService categoryService)
    {
        var errors = new Dictionary<string, string[]>();
        if (string.IsNullOrWhiteSpace(request.Name))
            errors["name"] = ["Name is required."];
        else if (request.Name.Trim().Length > 200)
            errors["name"] = ["Name cannot exceed 200 characters."];

        if (request.Description.Length > 1000)
            errors["description"] = ["Description cannot exceed 1000 characters."];
        if (request.Price <= 0)
            errors["price"] = ["Price must be greater than zero."];
        if (!categoryService.CategoryExists(request.CategoryId))
            errors["categoryId"] = ["Category does not exist."];
        if (!request.Status.Equals("active", StringComparison.OrdinalIgnoreCase)
            && !request.Status.Equals("inactive", StringComparison.OrdinalIgnoreCase))
            errors["status"] = ["Status must be active or inactive."];

        if (request.Image is not null)
        {
            if (request.Image.Length == 0 || request.Image.Length > MaxImageSize)
                errors["image"] = ["Image must be between 1 byte and 10 MB."];
            else if (!AllowedImageTypes.Contains(request.Image.ContentType.ToLowerInvariant()))
                errors["image"] = ["Image must be JPEG, PNG, WebP, or AVIF."];
        }

        return errors;
    }
}
