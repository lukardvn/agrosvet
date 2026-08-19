using Agrosvet.Api.Models;
using Agrosvet.Api.Repositories;
using Agrosvet.Api.Storage;

namespace Agrosvet.Api.Services;

public interface ICategoryService
{
    IEnumerable<Category> GetAllCategories();
    Category? GetCategoryById(int id);
    IEnumerable<Category> GetSubcategories(int parentId);
    IEnumerable<Category> GetTopLevelCategories();
    bool CategoryExists(int id);
    Task<Category> CreateCategoryAsync(Category category, IFormFile? image, CancellationToken cancellationToken);
    Task<Category?> UpdateCategoryAsync(int id, Category category, IFormFile? image, CancellationToken cancellationToken);
    Task<bool> DeleteCategoryAsync(int id, CancellationToken cancellationToken);
}

public class CategoryService(
    ICategoryRepository categoryRepository,
    IImageStorage imageStorage,
    ILogger<CategoryService> logger) : ICategoryService
{
    public IEnumerable<Category> GetAllCategories() => categoryRepository.GetAll();

    public Category? GetCategoryById(int id) => categoryRepository.GetById(id);

    public IEnumerable<Category> GetSubcategories(int parentId) => categoryRepository.GetSubcategories(parentId);

    public IEnumerable<Category> GetTopLevelCategories() => categoryRepository.GetTopLevel();

    public bool CategoryExists(int id) => categoryRepository.Exists(id);

    public async Task<Category> CreateCategoryAsync(
        Category category,
        IFormFile? image,
        CancellationToken cancellationToken)
    {
        StoredImage? storedImage = null;
        if (image is not null)
        {
            storedImage = await imageStorage.UploadAsync(image, "categories", cancellationToken);
            category.ImageUrl = storedImage.Url;
            category.ImageStorageKey = storedImage.StorageKey;
        }

        try
        {
            return categoryRepository.Create(category);
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

    public async Task<Category?> UpdateCategoryAsync(
        int id,
        Category category,
        IFormFile? image,
        CancellationToken cancellationToken)
    {
        var existing = categoryRepository.GetByIdForUpdate(id);
        if (existing is null) return null;

        StoredImage? replacement = null;
        var previousStorageKey = existing.ImageStorageKey;
        if (image is not null)
        {
            replacement = await imageStorage.UploadAsync(image, "categories", cancellationToken);
        }

        existing.Name = category.Name;
        existing.ParentCategoryId = category.ParentCategoryId;
        if (replacement is not null)
        {
            existing.ImageUrl = replacement.Url;
            existing.ImageStorageKey = replacement.StorageKey;
        }

        try
        {
            categoryRepository.SaveChanges();
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

    public async Task<bool> DeleteCategoryAsync(int id, CancellationToken cancellationToken)
    {
        var category = categoryRepository.GetByIdForUpdate(id);
        if (category is null) return false;

        var storageKey = category.ImageStorageKey;
        categoryRepository.Delete(category);
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
            logger.LogWarning(exception, "Could not delete category image {StorageKey} from R2.", storageKey);
        }
    }
}
