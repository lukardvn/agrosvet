using Agrosvet.Api.Data;
using Agrosvet.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace Agrosvet.Api.Repositories;

public interface ICategoryRepository
{
    IEnumerable<Category> GetAll();
    Category? GetById(int id);
    IEnumerable<Category> GetSubcategories(int parentId);
    IEnumerable<Category> GetTopLevel();
    bool Exists(int id);
    Category Create(Category category);
    bool Update(Category category);
    bool Delete(int id);
}

public class CategoryRepository(AgrosvetDbContext context) : ICategoryRepository
{
    public IEnumerable<Category> GetAll() =>
        context.Categories.AsNoTracking().ToList();

    public Category? GetById(int id) =>
        context.Categories.AsNoTracking().FirstOrDefault(c => c.Id == id);

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

    public bool Update(Category category)
    {
        var existing = context.Categories.Find(category.Id);
        if (existing is null) return false;

        existing.Name = category.Name;
        existing.ParentCategoryId = category.ParentCategoryId;
        context.SaveChanges();
        return true;
    }

    public bool Delete(int id)
    {
        var category = context.Categories.Find(id);
        if (category is null) return false;

        context.Categories.Remove(category);
        context.SaveChanges();
        return true;
    }
}
