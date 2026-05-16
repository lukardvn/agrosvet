using Agrosvet.Api.Models;
using Agrosvet.Api.Services;

namespace Agrosvet.Api.Endpoints;

public static class CategoryEndpoints
{
    public static void MapCategoryEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/categories");

        group.MapGet("/", (ICategoryService categoryService) => 
            Results.Ok(categoryService.GetAllCategories()))
        .WithName("GetCategories");

        group.MapGet("/{id}", (int id, ICategoryService categoryService) =>
        {
            var category = categoryService.GetCategoryById(id);
            return category is not null ? Results.Ok(category) : Results.NotFound();
        })
        .WithName("GetCategoryById");

        group.MapGet("/{id}/products", (int id, IProductService productService) => 
            Results.Ok(productService.GetProductsByCategory(id)))
        .WithName("GetProductsByCategoryId");

        group.MapPost("/", (Category category, ICategoryService categoryService) =>
        {
            var createdCategory = categoryService.CreateCategory(category);
            return Results.Created($"/categories/{createdCategory.Id}", createdCategory);
        })
        .WithName("CreateCategory");

        group.MapPut("/{id}", (int id, Category category, ICategoryService categoryService) =>
        {
            if (id != category.Id) return Results.BadRequest();
            var success = categoryService.UpdateCategory(category);
            return success ? Results.NoContent() : Results.NotFound();
        })
        .WithName("UpdateCategory");

        group.MapDelete("/{id}", (int id, ICategoryService categoryService) =>
        {
            var success = categoryService.DeleteCategory(id);
            return success ? Results.NoContent() : Results.NotFound();
        })
        .WithName("DeleteCategory");
    }
}
