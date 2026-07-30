using System.ComponentModel.DataAnnotations;

namespace Agrosvet.Api.Models;

public class ProductImage
{
    public int Id { get; set; }

    public int ProductId { get; set; }

    [Required]
    [MaxLength(500)]
    public string Url { get; set; } = string.Empty;

    [MaxLength(200)]
    public string? AltText { get; set; }

    public int SortOrder { get; set; }

    // Navigation property
    public Product Product { get; set; } = null!;
}
