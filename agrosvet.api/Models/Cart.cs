using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Agrosvet.Api.Models;

public class CartItem
{
    public int Id { get; set; }

    public int CartId { get; set; }

    public int ProductId { get; set; }

    [MaxLength(200)]
    public string ProductName { get; set; } = string.Empty;

    public int Quantity { get; set; }

    public decimal Price { get; set; }

    // Navigation property
    public Cart Cart { get; set; } = null!;
}

public class Cart
{
    public int Id { get; set; }

    public List<CartItem> Items { get; set; } = new();

    [NotMapped]
    public decimal TotalPrice => Items.Sum(item => item.Price * item.Quantity);
}
