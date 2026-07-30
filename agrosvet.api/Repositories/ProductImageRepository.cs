using Agrosvet.Api.Data;
using Agrosvet.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace Agrosvet.Api.Repositories;

public interface IProductImageRepository
{
    IEnumerable<ProductImage> GetByProductId(int productId);
    ProductImage? GetById(int id);
    ProductImage Create(ProductImage image);
    bool Update(ProductImage image);
    bool Delete(int id);
    bool DeleteByProductId(int productId);
}

public class ProductImageRepository(AgrosvetDbContext context) : IProductImageRepository
{
    public IEnumerable<ProductImage> GetByProductId(int productId) =>
        context.ProductImages.AsNoTracking()
            .Where(i => i.ProductId == productId)
            .OrderBy(i => i.SortOrder)
            .ToList();

    public ProductImage? GetById(int id) =>
        context.ProductImages.AsNoTracking().FirstOrDefault(i => i.Id == id);

    public ProductImage Create(ProductImage image)
    {
        context.ProductImages.Add(image);
        context.SaveChanges();
        return image;
    }

    public bool Update(ProductImage image)
    {
        var existing = context.ProductImages.Find(image.Id);
        if (existing is null) return false;

        existing.Url = image.Url;
        existing.AltText = image.AltText;
        existing.SortOrder = image.SortOrder;
        context.SaveChanges();
        return true;
    }

    public bool Delete(int id)
    {
        var image = context.ProductImages.Find(id);
        if (image is null) return false;

        context.ProductImages.Remove(image);
        context.SaveChanges();
        return true;
    }

    public bool DeleteByProductId(int productId)
    {
        var images = context.ProductImages.Where(i => i.ProductId == productId).ToList();
        if (images.Count == 0) return false;

        context.ProductImages.RemoveRange(images);
        context.SaveChanges();
        return true;
    }
}
