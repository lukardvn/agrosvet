using Microsoft.AspNetCore.Mvc;

namespace Agrosvet.Api.Contracts;

public sealed record ProductDto(
    int Id,
    string Name,
    string Description,
    string ImageUrl,
    decimal Price,
    int CategoryId,
    string Status);

public sealed class ProductUpsertRequest
{
    [FromForm(Name = "name")]
    public string Name { get; init; } = string.Empty;

    [FromForm(Name = "description")]
    public string Description { get; init; } = string.Empty;

    [FromForm(Name = "price")]
    public decimal Price { get; init; }

    [FromForm(Name = "categoryId")]
    public int CategoryId { get; init; }

    [FromForm(Name = "status")]
    public string Status { get; init; } = "active";

    [FromForm(Name = "image")]
    public IFormFile? Image { get; init; }
}
