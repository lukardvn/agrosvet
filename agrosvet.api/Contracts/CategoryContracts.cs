namespace Agrosvet.Api.Contracts;

public sealed record CategoryDto(int Id, string Name, int? ParentId);

public sealed record CategoryUpsertRequest(string Name, int? ParentId);
