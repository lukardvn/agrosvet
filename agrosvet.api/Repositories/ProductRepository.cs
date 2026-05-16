using Agrosvet.Api.Models;

namespace Agrosvet.Api.Repositories;

public interface IProductRepository
{
    IEnumerable<Product> GetAll();
    Product? GetById(int id);
    IEnumerable<Product> GetByCategory(int categoryId);
    Product Create(Product product);
    bool Update(Product product);
    bool Delete(int id);
}

public class ProductRepository : IProductRepository
{
    private readonly List<Product> _products = new()
    {
        new Product(1, "Seme Kukuruza", "Visokoprinosni hibrid kukuruza.", 1500.00m, 1),
        new Product(2, "Mineralno Đubrivo NPK", "Univerzalno đubrivo za sve kulture.", 2500.00m, 2),
        new Product(3, "Herbicid Total", "Sredstvo za suzbijanje korova.", 1200.00m, 3)
    };

    public IEnumerable<Product> GetAll() => _products;

    public Product? GetById(int id) => _products.FirstOrDefault(p => p.Id == id);

    public IEnumerable<Product> GetByCategory(int categoryId) => _products.Where(p => p.CategoryId == categoryId);

    public Product Create(Product product)
    {
        var id = _products.Max(p => p.Id) + 1;
        var newProduct = product with { Id = id };
        _products.Add(newProduct);
        return newProduct;
    }

    public bool Update(Product product)
    {
        var index = _products.FindIndex(p => p.Id == product.Id);
        if (index == -1) return false;
        _products[index] = product;
        return true;
    }

    public bool Delete(int id)
    {
        var product = GetById(id);
        if (product is null) return false;
        _products.Remove(product);
        return true;
    }
}
