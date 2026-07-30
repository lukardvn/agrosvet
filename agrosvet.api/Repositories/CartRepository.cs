using Agrosvet.Api.Data;
using Agrosvet.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace Agrosvet.Api.Repositories;

public interface ICartRepository
{
    Cart GetById(int id);
    void Update(Cart cart);
    void Clear(int id);
}

public class CartRepository(AgrosvetDbContext context) : ICartRepository
{
    public Cart GetById(int id)
    {
        var cart = context.Carts.Include(c => c.Items).FirstOrDefault(c => c.Id == id);
        if (cart is not null) return cart;

        cart = new Cart { Id = id };
        context.Carts.Add(cart);
        context.SaveChanges();
        return cart;
    }

    public void Update(Cart cart)
    {
        context.SaveChanges();
    }

    public void Clear(int id)
    {
        var cart = context.Carts.Include(c => c.Items).FirstOrDefault(c => c.Id == id);
        if (cart is null) return;

        cart.Items.Clear();
        context.SaveChanges();
    }
}
