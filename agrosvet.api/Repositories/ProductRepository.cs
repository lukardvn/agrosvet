using Agrosvet.Api.Data;
using Agrosvet.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace Agrosvet.Api.Repositories;

public interface IProductRepository
{
    IEnumerable<Product> GetAll();
    Product? GetById(int id);
    Product? GetByIdForUpdate(int id);
    IEnumerable<Product> GetByCategory(int categoryId);
    Product Create(Product product);
    void SaveChanges();
    void Delete(Product product);
}

public class ProductRepository(AgrosvetDbContext context) : IProductRepository
{
    public IEnumerable<Product> GetAll() =>
        context.Products.AsNoTracking().Include(p => p.Image).ToList();

    public Product? GetById(int id) =>
        context.Products.AsNoTracking().Include(p => p.Image).FirstOrDefault(p => p.Id == id);

    public Product? GetByIdForUpdate(int id) =>
        context.Products.Include(p => p.Image).FirstOrDefault(p => p.Id == id);

    public IEnumerable<Product> GetByCategory(int categoryId) =>
        context.Products.AsNoTracking().Include(p => p.Image).Where(p => p.CategoryId == categoryId).ToList();

    public Product Create(Product product)
    {
        context.Products.Add(product);
        context.SaveChanges();
        return product;
    }

    public void SaveChanges() => context.SaveChanges();

    public void Delete(Product product)
    {
        context.Products.Remove(product);
        context.SaveChanges();
    }
}
