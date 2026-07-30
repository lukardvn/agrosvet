using System.ComponentModel.DataAnnotations;

namespace Agrosvet.Api.Models;

public class Product
{
    public int Id { get; set; }

    [Required]
    [MaxLength(200)]
    public string Name { get; set; } = string.Empty;

    [MaxLength(1000)]
    public string Description { get; set; } = string.Empty;

    public decimal Price { get; set; }

    public int CategoryId { get; set; }

    // Navigation properties
    public Category Category { get; set; } = null!;
    public List<ProductImage> Images { get; set; } = new();
}
