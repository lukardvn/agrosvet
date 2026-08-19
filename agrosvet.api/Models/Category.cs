using System.ComponentModel.DataAnnotations;

namespace Agrosvet.Api.Models;

public class Category
{
    public int Id { get; set; }

    [Required]
    [MaxLength(100)]
    public string Name { get; set; } = string.Empty;

    public int? ParentCategoryId { get; set; }

    [MaxLength(500)]
    public string? ImageUrl { get; set; }

    [MaxLength(500)]
    public string? ImageStorageKey { get; set; }

    // Navigation properties
    public Category? ParentCategory { get; set; }
    public List<Category> Subcategories { get; set; } = new();
    public List<Product> Products { get; set; } = new();
}
