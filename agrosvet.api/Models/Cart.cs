namespace Agrosvet.Api.Models;

public record CartItem(int ProductId, string ProductName, int Quantity, decimal Price);

public class Cart
{
    public int Id { get; init; }
    public List<CartItem> Items { get; set; } = new();
    public decimal TotalPrice => Items.Sum(item => item.Price * item.Quantity);
}
