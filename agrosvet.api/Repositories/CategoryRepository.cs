using Agrosvet.Api.Models;

namespace Agrosvet.Api.Repositories;

public interface ICategoryRepository
{
    IEnumerable<Category> GetAll();
    Category? GetById(int id);
    Category Create(Category category);
    bool Update(Category category);
    bool Delete(int id);
}

public class CategoryRepository : ICategoryRepository
{
    private readonly List<Category> _categories = new()
    {
        new Category(1, "Seme", "Seme za različite poljoprivredne kulture."),
        new Category(2, "Đubrivo", "Mineralna i organska đubriva."),
        new Category(3, "Zaštita bilja", "Herbicidi, fungicidi i insekticidi."),
        new Category(4, "Alati", "Ručni i motorni alati za poljoprivredu.")
    };

    public IEnumerable<Category> GetAll() => _categories;

    public Category? GetById(int id) => _categories.FirstOrDefault(c => c.Id == id);

    public Category Create(Category category)
    {
        var id = _categories.Any() ? _categories.Max(c => c.Id) + 1 : 1;
        var newCategory = category with { Id = id };
        _categories.Add(newCategory);
        return newCategory;
    }

    public bool Update(Category category)
    {
        var index = _categories.FindIndex(c => c.Id == category.Id);
        if (index == -1) return false;
        _categories[index] = category;
        return true;
    }

    public bool Delete(int id)
    {
        var category = GetById(id);
        if (category is null) return false;
        _categories.Remove(category);
        return true;
    }
}
