using Agrosvet.Api.Contracts;
using Agrosvet.Api.Models;
using Agrosvet.Api.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Agrosvet.Api.Endpoints;

public static class CategoryEndpoints
{
    private const long MaxImageSize = 10 * 1024 * 1024;
    private static readonly HashSet<string> AllowedImageTypes =
    [
        "image/jpeg",
        "image/png",
        "image/webp",
        "image/avif"
    ];

    public static void MapCategoryEndpoints(this IEndpointRouteBuilder app)
    {
        var publicGroup = app.MapGroup("/categories");
        var adminGroup = app.MapGroup("/admin/categories");

        publicGroup.MapGet("/", (ICategoryService categoryService) =>
            Results.Ok(categoryService.GetAllCategories().Select(category => category.ToDto())))
        .WithName("GetCategories");

        publicGroup.MapGet("/top-level", (ICategoryService categoryService) =>
            Results.Ok(categoryService.GetTopLevelCategories().Select(category => category.ToDto())))
        .WithName("GetTopLevelCategories");

        publicGroup.MapGet("/{id}", (int id, ICategoryService categoryService) =>
        {
            var category = categoryService.GetCategoryById(id);
            return category is not null ? Results.Ok(category.ToDto()) : Results.NotFound();
        })
        .WithName("GetCategoryById");

        publicGroup.MapGet("/{id}/subcategories", (int id, ICategoryService categoryService) =>
            Results.Ok(categoryService.GetSubcategories(id).Select(category => category.ToDto())))
        .WithName("GetSubcategories");

        publicGroup.MapGet("/{id}/products", (int id, IProductService productService) =>
            Results.Ok(productService.GetActiveProductsByCategory(id).Select(product => product.ToDto())))
        .WithName("GetProductsByCategoryId");

        adminGroup.MapPost("/", async (
            [FromForm] CategoryUpsertRequest request,
            ICategoryService categoryService,
            CancellationToken cancellationToken) =>
        {
            var errors = Validate(request, null, categoryService);
            if (errors.Count > 0) return Results.ValidationProblem(errors);

            var createdCategory = await categoryService.CreateCategoryAsync(
                ToCategory(request),
                request.Image,
                cancellationToken);
            return Results.Created($"/categories/{createdCategory.Id}", createdCategory.ToDto());
        })
        .DisableAntiforgery()
        .WithName("CreateCategory");

        adminGroup.MapPut("/{id}", async (
            int id,
            [FromForm] CategoryUpsertRequest request,
            ICategoryService categoryService,
            CancellationToken cancellationToken) =>
        {
            var errors = Validate(request, id, categoryService);
            if (errors.Count > 0) return Results.ValidationProblem(errors);

            var category = await categoryService.UpdateCategoryAsync(
                id,
                ToCategory(request),
                request.Image,
                cancellationToken);
            return category is not null ? Results.Ok(category.ToDto()) : Results.NotFound();
        })
        .DisableAntiforgery()
        .WithName("UpdateCategory");

        adminGroup.MapDelete("/{id}", async (
            int id,
            ICategoryService categoryService,
            CancellationToken cancellationToken) =>
        {
            try
            {
                var success = await categoryService.DeleteCategoryAsync(id, cancellationToken);
                return success
                    ? Results.NoContent()
                    : Results.NotFound();
            }
            catch (DbUpdateException)
            {
                return Results.Conflict(new
                {
                    Detail = "Kategorija ne može da se obriše dok sadrži proizvode ili podkategorije."
                });
            }
        })
        .WithName("DeleteCategory");
    }

    private static Category ToCategory(CategoryUpsertRequest request) => new()
    {
        Name = request.Name.Trim(),
        ParentCategoryId = request.ParentId
    };

    private static Dictionary<string, string[]> Validate(
        CategoryUpsertRequest request,
        int? categoryId,
        ICategoryService categoryService)
    {
        var errors = new Dictionary<string, string[]>();
        if (string.IsNullOrWhiteSpace(request.Name))
            errors["name"] = ["Name is required."];
        else if (request.Name.Trim().Length > 100)
            errors["name"] = ["Name cannot exceed 100 characters."];

        if (request.ParentId is not null)
        {
            if (!categoryService.CategoryExists(request.ParentId.Value))
                errors["parentId"] = ["Parent category does not exist."];
            else if (categoryId == request.ParentId || CreatesCycle(categoryId, request.ParentId.Value, categoryService))
                errors["parentId"] = ["A category cannot use itself or one of its descendants as its parent."];
        }

        if (request.Image is not null)
        {
            if (request.Image.Length == 0 || request.Image.Length > MaxImageSize)
                errors["image"] = ["Image must be between 1 byte and 10 MB."];
            else if (!AllowedImageTypes.Contains(request.Image.ContentType.ToLowerInvariant()))
                errors["image"] = ["Image must be JPEG, PNG, WebP, or AVIF."];
        }

        return errors;
    }

    private static bool CreatesCycle(int? categoryId, int parentId, ICategoryService categoryService)
    {
        if (categoryId is null) return false;

        var visited = new HashSet<int>();
        var currentId = (int?)parentId;
        while (currentId is not null && visited.Add(currentId.Value))
        {
            if (currentId == categoryId) return true;
            currentId = categoryService.GetCategoryById(currentId.Value)?.ParentCategoryId;
        }
        return false;
    }
}
