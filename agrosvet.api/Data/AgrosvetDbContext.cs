using Agrosvet.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace Agrosvet.Api.Data;

public class AgrosvetDbContext(DbContextOptions<AgrosvetDbContext> options) : DbContext(options)
{
    public DbSet<Category> Categories => Set<Category>();
    public DbSet<Product> Products => Set<Product>();
    public DbSet<ProductImage> ProductImages => Set<ProductImage>();
    public DbSet<Cart> Carts => Set<Cart>();
    public DbSet<CartItem> CartItems => Set<CartItem>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // Category self-referencing relationship
        modelBuilder.Entity<Category>(entity =>
        {
            entity.HasOne(c => c.ParentCategory)
                  .WithMany(c => c.Subcategories)
                  .HasForeignKey(c => c.ParentCategoryId)
                  .OnDelete(DeleteBehavior.Restrict);

            entity.HasMany(c => c.Products)
                  .WithOne(p => p.Category)
                  .HasForeignKey(p => p.CategoryId)
                  .OnDelete(DeleteBehavior.Restrict);
        });

        // Product → Images
        modelBuilder.Entity<Product>(entity =>
        {
            entity.Property(p => p.Price)
                  .HasPrecision(18, 2);

            entity.HasMany(p => p.Images)
                  .WithOne(i => i.Product)
                  .HasForeignKey(i => i.ProductId)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        // Cart → CartItems
        modelBuilder.Entity<Cart>(entity =>
        {
            entity.HasMany(c => c.Items)
                  .WithOne(i => i.Cart)
                  .HasForeignKey(i => i.CartId)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<CartItem>(entity =>
        {
            entity.Property(ci => ci.Price)
                  .HasPrecision(18, 2);
        });

        // Seed data
        SeedData(modelBuilder);
    }

    private static void SeedData(ModelBuilder modelBuilder)
    {
        // Top-level categories
        modelBuilder.Entity<Category>().HasData(
            new { Id = 1, Name = "Seme", Description = "Seme za različite poljoprivredne kulture.", ParentCategoryId = (int?)null },
            new { Id = 2, Name = "Đubrivo", Description = "Mineralna i organska đubriva.", ParentCategoryId = (int?)null },
            new { Id = 3, Name = "Zaštita bilja", Description = "Herbicidi, fungicidi i insekticidi.", ParentCategoryId = (int?)null },
            new { Id = 4, Name = "Alati", Description = "Ručni i motorni alati za poljoprivredu.", ParentCategoryId = (int?)null },
            // Subcategories
            new { Id = 5, Name = "Seme povrća", Description = "Seme za razne vrste povrća.", ParentCategoryId = (int?)1 },
            new { Id = 6, Name = "Seme žitarica", Description = "Seme za pšenicu, kukuruz i ostale žitarice.", ParentCategoryId = (int?)1 },
            new { Id = 7, Name = "Mineralna đubriva", Description = "NPK i druga mineralna đubriva.", ParentCategoryId = (int?)2 },
            new { Id = 8, Name = "Organska đubriva", Description = "Kompost, stajnjak i biohumus.", ParentCategoryId = (int?)2 },
            new { Id = 9, Name = "Herbicidi", Description = "Sredstva za suzbijanje korova.", ParentCategoryId = (int?)3 },
            new { Id = 10, Name = "Fungicidi", Description = "Sredstva za suzbijanje gljivičnih bolesti.", ParentCategoryId = (int?)3 }
        );

        // Products
        modelBuilder.Entity<Product>().HasData(
            new { Id = 1, Name = "Seme Kukuruza", Description = "Visokoprinosni hibrid kukuruza.", Price = 1500.00m, CategoryId = 6 },
            new { Id = 2, Name = "Mineralno Đubrivo NPK", Description = "Univerzalno đubrivo za sve kulture.", Price = 2500.00m, CategoryId = 7 },
            new { Id = 3, Name = "Herbicid Total", Description = "Sredstvo za suzbijanje korova.", Price = 1200.00m, CategoryId = 9 }
        );

        // Product images
        modelBuilder.Entity<ProductImage>().HasData(
            new { Id = 1, ProductId = 1, Url = "/images/seme-kukuruza-1.jpg", AltText = "Seme kukuruza - pakovanje", SortOrder = 0 },
            new { Id = 2, ProductId = 1, Url = "/images/seme-kukuruza-2.jpg", AltText = "Seme kukuruza - krupni plan", SortOrder = 1 },
            new { Id = 3, ProductId = 2, Url = "/images/npk-djubrivo.jpg", AltText = "NPK đubrivo - pakovanje", SortOrder = 0 },
            new { Id = 4, ProductId = 3, Url = "/images/herbicid-total.jpg", AltText = "Herbicid Total - bočica", SortOrder = 0 }
        );
    }
}
