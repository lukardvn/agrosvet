using Agrosvet.Api.Models;
using Microsoft.AspNetCore.DataProtection.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Agrosvet.Api.Data;

public class AgrosvetDbContext(DbContextOptions<AgrosvetDbContext> options)
    : IdentityDbContext<ApplicationUser>(options), IDataProtectionKeyContext
{
    public DbSet<Category> Categories => Set<Category>();
    public DbSet<Product> Products => Set<Product>();
    public DbSet<ProductImage> ProductImages => Set<ProductImage>();
    public DbSet<Cart> Carts => Set<Cart>();
    public DbSet<CartItem> CartItems => Set<CartItem>();
    public DbSet<DataProtectionKey> DataProtectionKeys => Set<DataProtectionKey>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<IdentityRole>().HasData(
            new IdentityRole
            {
                Id = AppRoles.UserId,
                Name = AppRoles.User,
                NormalizedName = AppRoles.User.ToUpperInvariant(),
                ConcurrencyStamp = AppRoles.UserId
            },
            new IdentityRole
            {
                Id = AppRoles.AdminId,
                Name = AppRoles.Admin,
                NormalizedName = AppRoles.Admin.ToUpperInvariant(),
                ConcurrencyStamp = AppRoles.AdminId
            });

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

        // Product has exactly one image record at most.
        modelBuilder.Entity<Product>(entity =>
        {
            entity.Property(p => p.Price)
                  .HasPrecision(18, 2);

            entity.Property(p => p.Status)
                  .HasConversion(
                      status => status == ProductStatus.Active ? "active" : "inactive",
                      value => value == "inactive" ? ProductStatus.Inactive : ProductStatus.Active)
                  .HasMaxLength(20)
                  .HasDefaultValue(ProductStatus.Active);

            entity.HasOne(p => p.Image)
                  .WithOne(i => i.Product)
                  .HasForeignKey<ProductImage>(i => i.ProductId)
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
            new { Id = 1, Name = "Seme", ParentCategoryId = (int?)null },
            new { Id = 2, Name = "Đubrivo", ParentCategoryId = (int?)null },
            new { Id = 3, Name = "Zaštita bilja", ParentCategoryId = (int?)null },
            new { Id = 4, Name = "Alati", ParentCategoryId = (int?)null },
            // Subcategories
            new { Id = 5, Name = "Seme povrća", ParentCategoryId = (int?)1 },
            new { Id = 6, Name = "Seme žitarica", ParentCategoryId = (int?)1 },
            new { Id = 7, Name = "Mineralna đubriva", ParentCategoryId = (int?)2 },
            new { Id = 8, Name = "Organska đubriva", ParentCategoryId = (int?)2 },
            new { Id = 9, Name = "Herbicidi", ParentCategoryId = (int?)3 },
            new { Id = 10, Name = "Fungicidi", ParentCategoryId = (int?)3 }
        );

        // Products
        modelBuilder.Entity<Product>().HasData(
            new { Id = 1, Name = "Seme Kukuruza", Description = "Visokoprinosni hibrid kukuruza.", Price = 1500.00m, CategoryId = 6, Status = ProductStatus.Active },
            new { Id = 2, Name = "Mineralno Đubrivo NPK", Description = "Univerzalno đubrivo za sve kulture.", Price = 2500.00m, CategoryId = 7, Status = ProductStatus.Active },
            new { Id = 3, Name = "Herbicid Total", Description = "Sredstvo za suzbijanje korova.", Price = 1200.00m, CategoryId = 9, Status = ProductStatus.Active }
        );

        // Product images
        modelBuilder.Entity<ProductImage>().HasData(
            new { Id = 1, ProductId = 1, Url = "/images/seme-kukuruza-1.jpg", StorageKey = (string?)null },
            new { Id = 3, ProductId = 2, Url = "/images/npk-djubrivo.jpg", StorageKey = (string?)null },
            new { Id = 4, ProductId = 3, Url = "/images/herbicid-total.jpg", StorageKey = (string?)null }
        );
    }
}
