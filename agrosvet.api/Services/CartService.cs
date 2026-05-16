using Agrosvet.Api.Models;
using Agrosvet.Api.Repositories;

namespace Agrosvet.Api.Services;

public interface ICartService
{
    Cart GetCart(int cartId);
    Cart AddItem(int cartId, int productId, int quantity);
    Cart RemoveItem(int cartId, int productId);
    void ClearCart(int cartId);
}

public class CartService(ICartRepository cartRepository, IProductRepository productRepository) : ICartService
{
    public Cart GetCart(int cartId) => cartRepository.GetById(cartId);

    public Cart AddItem(int cartId, int productId, int quantity)
    {
        var cart = cartRepository.GetById(cartId);
        var product = productRepository.GetById(productId);

        if (product != null)
        {
            var existingItem = cart.Items.FirstOrDefault(i => i.ProductId == productId);
            if (existingItem != null)
            {
                var updatedItem = existingItem with { Quantity = existingItem.Quantity + quantity };
                cart.Items.Remove(existingItem);
                cart.Items.Add(updatedItem);
            }
            else
            {
                cart.Items.Add(new CartItem(productId, product.Name, quantity, product.Price));
            }
            cartRepository.Update(cart);
        }
        return cart;
    }

    public Cart RemoveItem(int cartId, int productId)
    {
        var cart = cartRepository.GetById(cartId);
        var item = cart.Items.FirstOrDefault(i => i.ProductId == productId);
        if (item != null)
        {
            cart.Items.Remove(item);
            cartRepository.Update(cart);
        }
        return cart;
    }

    public void ClearCart(int cartId) => cartRepository.Clear(cartId);
}
