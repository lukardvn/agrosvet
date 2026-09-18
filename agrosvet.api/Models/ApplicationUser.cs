using Microsoft.AspNetCore.Identity;

namespace Agrosvet.Api.Models;

public sealed class ApplicationUser : IdentityUser;

public static class AppRoles
{
    public const string User = "User";
    public const string Admin = "Admin";

    public const string UserId = "8f37a034-909d-49d8-82d1-da355e0a7485";
    public const string AdminId = "ea45b977-dc43-4784-a934-49d0a05149b8";
}
