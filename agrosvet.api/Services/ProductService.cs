using Agrosvet.Api.Models;
using Agrosvet.Api.Repositories;
using Agrosvet.Api.Storage;

namespace Agrosvet.Api.Services;

public interface IProductService
{
    IEnumerable<Product> GetAllProducts();
    Product? GetProductById(int id);
    IEnumerable<Product> GetProductsByCategory(int categoryId);
    Task<Product> CreateProductAsync(Product product, IFormFile? image, CancellationToken cancellationToken);
    Task<Product?> UpdateProductAsync(int id, Product product, IFormFile? image, CancellationToken cancellationToken);
    Task<bool> DeleteProductAsync(int id, CancellationToken cancellationToken);
}

public class ProductService(
    IProductRepository productRepository,
    IProductImageStorage imageStorage,
    ILogger<ProductService> logger) : IProductService
{
    public IEnumerable<Product> GetAllProducts() => productRepository.GetAll();

    public Product? GetProductById(int id) => productRepository.GetById(id);

    public IEnumerable<Product> GetProductsByCategory(int categoryId) => productRepository.GetByCategory(categoryId);

    public async Task<Product> CreateProductAsync(
        Product product,
        IFormFile? image,
        CancellationToken cancellationToken)
    {
        StoredImage? storedImage = null;
        if (image is not null)
        {
            storedImage = await imageStorage.UploadAsync(image, cancellationToken);
            product.Image = new ProductImage
            {
                Url = storedImage.Url,
                StorageKey = storedImage.StorageKey
            };
        }

        try
        {
            return productRepository.Create(product);
        }
        catch
        {
            if (storedImage is not null)
            {
                await TryDeleteImageAsync(storedImage.StorageKey, cancellationToken);
            }
            throw;
        }
    }

    public async Task<Product?> UpdateProductAsync(
        int id,
        Product product,
        IFormFile? image,
        CancellationToken cancellationToken)
    {
        var existing = productRepository.GetByIdForUpdate(id);
        if (existing is null) return null;

        StoredImage? replacement = null;
        var previousStorageKey = existing.Image?.StorageKey;
        if (image is not null)
        {
            replacement = await imageStorage.UploadAsync(image, cancellationToken);
        }

        existing.Name = product.Name;
        existing.Description = product.Description;
        existing.Price = product.Price;
        existing.CategoryId = product.CategoryId;
        existing.Status = product.Status;

        if (replacement is not null)
        {
            if (existing.Image is null)
            {
                existing.Image = new ProductImage
                {
                    Url = replacement.Url,
                    StorageKey = replacement.StorageKey
                };
            }
            else
            {
                existing.Image.Url = replacement.Url;
                existing.Image.StorageKey = replacement.StorageKey;
            }
        }

        try
        {
            productRepository.SaveChanges();
        }
        catch
        {
            if (replacement is not null)
            {
                await TryDeleteImageAsync(replacement.StorageKey, cancellationToken);
            }
            throw;
        }

        if (replacement is not null && !string.IsNullOrWhiteSpace(previousStorageKey))
        {
            await TryDeleteImageAsync(previousStorageKey, cancellationToken);
        }

        return existing;
    }

    public async Task<bool> DeleteProductAsync(int id, CancellationToken cancellationToken)
    {
        var product = productRepository.GetByIdForUpdate(id);
        if (product is null) return false;

        var storageKey = product.Image?.StorageKey;
        productRepository.Delete(product);
        if (!string.IsNullOrWhiteSpace(storageKey))
        {
            await TryDeleteImageAsync(storageKey, cancellationToken);
        }
        return true;
    }

    private async Task TryDeleteImageAsync(string storageKey, CancellationToken cancellationToken)
    {
        try
        {
            await imageStorage.DeleteAsync(storageKey, cancellationToken);
        }
        catch (Exception exception)
        {
            logger.LogWarning(exception, "Could not delete product image {StorageKey} from R2.", storageKey);
        }
    }
}
