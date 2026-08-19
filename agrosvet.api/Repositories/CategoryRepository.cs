using Agrosvet.Api.Data;
using Agrosvet.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace Agrosvet.Api.Repositories;

public interface ICategoryRepository
{
    IEnumerable<Category> GetAll();
    Category? GetById(int id);
    Category? GetByIdForUpdate(int id);
    IEnumerable<Category> GetSubcategories(int parentId);
    IEnumerable<Category> GetTopLevel();
    bool Exists(int id);
    Category Create(Category category);
    void SaveChanges();
    void Delete(Category category);
}

public class CategoryRepository(AgrosvetDbContext context) : ICategoryRepository
{
    public IEnumerable<Category> GetAll() =>
        context.Categories.AsNoTracking().ToList();

    public Category? GetById(int id) =>
        context.Categories.AsNoTracking().FirstOrDefault(c => c.Id == id);

    public Category? GetByIdForUpdate(int id) =>
        context.Categories.FirstOrDefault(c => c.Id == id);

    public IEnumerable<Category> GetSubcategories(int parentId) =>
        context.Categories.AsNoTracking().Where(c => c.ParentCategoryId == parentId).ToList();

    public IEnumerable<Category> GetTopLevel() =>
        context.Categories.AsNoTracking().Where(c => c.ParentCategoryId == null).ToList();

    public bool Exists(int id) => context.Categories.Any(c => c.Id == id);

    public Category Create(Category category)
    {
        context.Categories.Add(category);
        context.SaveChanges();
        return category;
    }

    public void SaveChanges() => context.SaveChanges();

    public void Delete(Category category)
    {
        context.Categories.Remove(category);
        context.SaveChanges();
    }
}
