using Agrosvet.Api.Contracts;
using Agrosvet.Api.Models;
using Agrosvet.Api.Services;
using Microsoft.EntityFrameworkCore;

namespace Agrosvet.Api.Endpoints;

public static class CategoryEndpoints
{
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

        adminGroup.MapPost("/", (CategoryUpsertRequest request, ICategoryService categoryService) =>
        {
            var errors = Validate(request, null, categoryService);
            if (errors.Count > 0) return Results.ValidationProblem(errors);

            var createdCategory = categoryService.CreateCategory(new Category
            {
                Name = request.Name.Trim(),
                ParentCategoryId = request.ParentId
            });
            return Results.Created($"/categories/{createdCategory.Id}", createdCategory.ToDto());
        })
        .WithName("CreateCategory");

        adminGroup.MapPut("/{id}", (int id, CategoryUpsertRequest request, ICategoryService categoryService) =>
        {
            if (categoryService.GetCategoryById(id) is null) return Results.NotFound();

            var errors = Validate(request, id, categoryService);
            if (errors.Count > 0) return Results.ValidationProblem(errors);

            var category = new Category
            {
                Id = id,
                Name = request.Name.Trim(),
                ParentCategoryId = request.ParentId
            };
            categoryService.UpdateCategory(category);
            return Results.Ok(category.ToDto());
        })
        .WithName("UpdateCategory");

        adminGroup.MapDelete("/{id}", (int id, ICategoryService categoryService) =>
        {
            try
            {
                var success = categoryService.DeleteCategory(id);
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
