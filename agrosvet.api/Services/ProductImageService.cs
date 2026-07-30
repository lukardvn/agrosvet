using Agrosvet.Api.Models;
using Agrosvet.Api.Repositories;

namespace Agrosvet.Api.Services;

public interface IProductImageService
{
    IEnumerable<ProductImage> GetImagesByProductId(int productId);
    ProductImage? GetImageById(int id);
    ProductImage CreateImage(ProductImage image);
    bool UpdateImage(ProductImage image);
    bool DeleteImage(int id);
    bool DeleteImagesByProductId(int productId);
}

public class ProductImageService(IProductImageRepository productImageRepository) : IProductImageService
{
    public IEnumerable<ProductImage> GetImagesByProductId(int productId) =>
        productImageRepository.GetByProductId(productId);

    public ProductImage? GetImageById(int id) =>
        productImageRepository.GetById(id);

    public ProductImage CreateImage(ProductImage image) =>
        productImageRepository.Create(image);

    public bool UpdateImage(ProductImage image) =>
        productImageRepository.Update(image);

    public bool DeleteImage(int id) =>
        productImageRepository.Delete(id);

    public bool DeleteImagesByProductId(int productId) =>
        productImageRepository.DeleteByProductId(productId);
}
