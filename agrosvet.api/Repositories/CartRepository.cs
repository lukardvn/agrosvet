using Agrosvet.Api.Models;

namespace Agrosvet.Api.Repositories;

public interface ICartRepository
{
    Cart GetById(int id);
    void Update(Cart cart);
    void Clear(int id);
}

public class CartRepository : ICartRepository
{
    private readonly Dictionary<int, Cart> _carts = new();

    public Cart GetById(int id)
    {
        if (!_carts.ContainsKey(id))
        {
            _carts[id] = new Cart { Id = id };
        }
        return _carts[id];
    }

    public void Update(Cart cart)
    {
        _carts[cart.Id] = cart;
    }

    public void Clear(int id)
    {
        if (_carts.ContainsKey(id))
        {
            _carts[id].Items.Clear();
        }
    }
}
