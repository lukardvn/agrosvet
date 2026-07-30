using Agrosvet.Api.Models;
using Agrosvet.Api.Services;

namespace Agrosvet.Api.Endpoints;

public static class ProductImageEndpoints
{
    public static void MapProductImageEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/products/{productId}/images");

        group.MapGet("/", (int productId, IProductImageService imageService) =>
            Results.Ok(imageService.GetImagesByProductId(productId)))
        .WithName("GetProductImages");

        group.MapGet("/{imageId}", (int productId, int imageId, IProductImageService imageService) =>
        {
            var image = imageService.GetImageById(imageId);
            if (image is null || image.ProductId != productId) return Results.NotFound();
            return Results.Ok(image);
        })
        .WithName("GetProductImageById");

        group.MapPost("/", (int productId, ProductImage image, IProductImageService imageService) =>
        {
            image.ProductId = productId;
            var created = imageService.CreateImage(image);
            return Results.Created($"/products/{productId}/images/{created.Id}", created);
        })
        .WithName("CreateProductImage");

        group.MapPut("/{imageId}", (int productId, int imageId, ProductImage image, IProductImageService imageService) =>
        {
            if (imageId != image.Id) return Results.BadRequest();
            image.ProductId = productId;
            var success = imageService.UpdateImage(image);
            return success ? Results.NoContent() : Results.NotFound();
        })
        .WithName("UpdateProductImage");

        group.MapDelete("/{imageId}", (int productId, int imageId, IProductImageService imageService) =>
        {
            var image = imageService.GetImageById(imageId);
            if (image is null || image.ProductId != productId) return Results.NotFound();
            imageService.DeleteImage(imageId);
            return Results.NoContent();
        })
        .WithName("DeleteProductImage");
    }
}
