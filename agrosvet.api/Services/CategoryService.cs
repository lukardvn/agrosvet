using Agrosvet.Api.Models;
using Agrosvet.Api.Repositories;

namespace Agrosvet.Api.Services;

public interface ICategoryService
{
    IEnumerable<Category> GetAllCategories();
    Category? GetCategoryById(int id);
    Category CreateCategory(Category category);
    bool UpdateCategory(Category category);
    bool DeleteCategory(int id);
}

public class CategoryService(ICategoryRepository categoryRepository) : ICategoryService
{
    public IEnumerable<Category> GetAllCategories() => categoryRepository.GetAll();

    public Category? GetCategoryById(int id) => categoryRepository.GetById(id);

    public Category CreateCategory(Category category) => categoryRepository.Create(category);

    public bool UpdateCategory(Category category) => categoryRepository.Update(category);

    public bool DeleteCategory(int id) => categoryRepository.Delete(id);
}
