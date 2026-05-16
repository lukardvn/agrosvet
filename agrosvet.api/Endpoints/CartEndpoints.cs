using Agrosvet.Api.Services;

namespace Agrosvet.Api.Endpoints;

public static class CartEndpoints
{
    public static void MapCartEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/cart");

        group.MapGet("/{cartId}", (int cartId, ICartService cartService) => 
            Results.Ok(cartService.GetCart(cartId)))
        .WithName("GetCart");

        group.MapPost("/{cartId}/items", (int cartId, int productId, int quantity, ICartService cartService) =>
        {
            var cart = cartService.AddItem(cartId, productId, quantity);
            return Results.Ok(cart);
        })
        .WithName("AddItemToCart");

        group.MapDelete("/{cartId}/items/{productId}", (int cartId, int productId, ICartService cartService) =>
        {
            var cart = cartService.RemoveItem(cartId, productId);
            return Results.Ok(cart);
        })
        .WithName("RemoveItemFromCart");

        group.MapDelete("/{cartId}", (int cartId, ICartService cartService) =>
        {
            cartService.ClearCart(cartId);
            return Results.NoContent();
        })
        .WithName("ClearCart");
    }
}
