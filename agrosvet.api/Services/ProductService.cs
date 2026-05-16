using Agrosvet.Api.Models;
using Agrosvet.Api.Repositories;

namespace Agrosvet.Api.Services;

public interface IProductService
{
    IEnumerable<Product> GetAllProducts();
    Product? GetProductById(int id);
    IEnumerable<Product> GetProductsByCategory(int categoryId);
    Product CreateProduct(Product product);
    bool UpdateProduct(Product product);
    bool DeleteProduct(int id);
}

public class ProductService(IProductRepository productRepository) : IProductService
{
    public IEnumerable<Product> GetAllProducts() => productRepository.GetAll();

    public Product? GetProductById(int id) => productRepository.GetById(id);

    public IEnumerable<Product> GetProductsByCategory(int categoryId) => productRepository.GetByCategory(categoryId);

    public Product CreateProduct(Product product) => productRepository.Create(product);

    public bool UpdateProduct(Product product) => productRepository.Update(product);

    public bool DeleteProduct(int id) => productRepository.Delete(id);
}
