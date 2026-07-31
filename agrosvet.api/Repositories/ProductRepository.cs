using Agrosvet.Api.Data;
using Agrosvet.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace Agrosvet.Api.Repositories;

public interface IProductRepository
{
    IEnumerable<Product> GetAll();
    Product? GetById(int id);
    IEnumerable<Product> GetAllActive();
    Product? GetActiveById(int id);
    Product? GetByIdForUpdate(int id);
    IEnumerable<Product> GetActiveByCategory(int categoryId);
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

    public IEnumerable<Product> GetAllActive() =>
        context.Products.AsNoTracking()
            .Include(p => p.Image)
            .Where(p => p.Status == ProductStatus.Active)
            .ToList();

    public Product? GetActiveById(int id) =>
        context.Products.AsNoTracking()
            .Include(p => p.Image)
            .FirstOrDefault(p => p.Id == id && p.Status == ProductStatus.Active);

    public Product? GetByIdForUpdate(int id) =>
        context.Products.Include(p => p.Image).FirstOrDefault(p => p.Id == id);

    public IEnumerable<Product> GetActiveByCategory(int categoryId) =>
        context.Products.AsNoTracking()
            .Include(p => p.Image)
            .Where(p => p.CategoryId == categoryId && p.Status == ProductStatus.Active)
            .ToList();

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
