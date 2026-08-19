using Agrosvet.Api.Models;

namespace Agrosvet.Api.Contracts;

public static class ContractMappings
{
    public static ProductDto ToDto(this Product product) => new(
        product.Id,
        product.Name,
        product.Description,
        product.Image?.Url ?? string.Empty,
        product.Price,
        product.CategoryId,
        product.Status == ProductStatus.Active ? "active" : "inactive");

    public static CategoryDto ToDto(this Category category) => new(
        category.Id,
        category.Name,
        category.ParentCategoryId,
        category.ImageUrl ?? string.Empty);
}
