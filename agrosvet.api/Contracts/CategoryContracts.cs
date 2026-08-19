using Microsoft.AspNetCore.Mvc;

namespace Agrosvet.Api.Contracts;

public sealed record CategoryDto(int Id, string Name, int? ParentId, string ImageUrl);

public sealed class CategoryUpsertRequest
{
    [FromForm(Name = "name")]
    public string Name { get; init; } = string.Empty;

    [FromForm(Name = "parentId")]
    public int? ParentId { get; init; }

    [FromForm(Name = "image")]
    public IFormFile? Image { get; init; }
}
