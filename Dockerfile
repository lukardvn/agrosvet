FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

# Copy csproj and restore
COPY agrosvet.api/agrosvet.api.csproj agrosvet.api/
RUN dotnet restore agrosvet.api/agrosvet.api.csproj

# Copy everything and publish
COPY agrosvet.api/ agrosvet.api/
RUN dotnet publish agrosvet.api/agrosvet.api.csproj -c Release -o /app --no-restore

# Runtime image
FROM mcr.microsoft.com/dotnet/aspnet:9.0
WORKDIR /app
COPY --from=build /app .

EXPOSE 8080
ENV ASPNETCORE_URLS=http://+:8080
ENTRYPOINT ["dotnet", "agrosvet.api.dll"]
