using Agrosvet.Api.Data;
using Agrosvet.Api.Models;
using Microsoft.EntityFrameworkCore;

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

public class ProductRepository(AgrosvetDbContext context) : IProductRepository
{
    public IEnumerable<Product> GetAll() =>
        context.Products.AsNoTracking().Include(p => p.Images).ToList();

    public Product? GetById(int id) =>
        context.Products.AsNoTracking().Include(p => p.Images).FirstOrDefault(p => p.Id == id);

    public IEnumerable<Product> GetByCategory(int categoryId) =>
        context.Products.AsNoTracking().Include(p => p.Images).Where(p => p.CategoryId == categoryId).ToList();

    public Product Create(Product product)
    {
        context.Products.Add(product);
        context.SaveChanges();
        return product;
    }

    public bool Update(Product product)
    {
        var existing = context.Products.Find(product.Id);
        if (existing is null) return false;

        existing.Name = product.Name;
        existing.Description = product.Description;
        existing.Price = product.Price;
        existing.CategoryId = product.CategoryId;
        context.SaveChanges();
        return true;
    }

    public bool Delete(int id)
    {
        var product = context.Products.Find(id);
        if (product is null) return false;

        context.Products.Remove(product);
        context.SaveChanges();
        return true;
    }
}
