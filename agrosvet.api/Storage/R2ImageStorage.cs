using Amazon.S3;
using Amazon.S3.Model;
using Microsoft.Extensions.Options;

namespace Agrosvet.Api.Storage;

public sealed record StoredImage(string Url, string StorageKey);

public interface IProductImageStorage
{
    Task<StoredImage> UploadAsync(IFormFile image, CancellationToken cancellationToken);
    Task DeleteAsync(string storageKey, CancellationToken cancellationToken);
}

public sealed class R2ImageStorage(IOptions<R2Options> options) : IProductImageStorage
{
    private readonly R2Options _options = options.Value;

    public async Task<StoredImage> UploadAsync(IFormFile image, CancellationToken cancellationToken)
    {
        ValidateConfiguration();

        var extension = image.ContentType.ToLowerInvariant() switch
        {
            "image/jpeg" => ".jpg",
            "image/png" => ".png",
            "image/webp" => ".webp",
            "image/avif" => ".avif",
            _ => throw new InvalidOperationException("Unsupported image type.")
        };
        var storageKey = $"products/{Guid.NewGuid():N}{extension}";
        using var stream = image.OpenReadStream();
        using var client = CreateClient();

        await client.PutObjectAsync(new PutObjectRequest
        {
            BucketName = _options.BucketName,
            Key = storageKey,
            InputStream = stream,
            ContentType = image.ContentType,
            AutoCloseStream = false
        }, cancellationToken);

        var publicUrl = $"{_options.PublicBaseUrl.TrimEnd('/')}/{storageKey}";
        return new StoredImage(publicUrl, storageKey);
    }

    public async Task DeleteAsync(string storageKey, CancellationToken cancellationToken)
    {
        if (string.IsNullOrWhiteSpace(storageKey)) return;
        ValidateConfiguration();
        using var client = CreateClient();
        await client.DeleteObjectAsync(_options.BucketName, storageKey, cancellationToken);
    }

    private AmazonS3Client CreateClient() => new(
        _options.AccessKeyId,
        _options.SecretAccessKey,
        new AmazonS3Config
        {
            ServiceURL = $"https://{_options.AccountId}.r2.cloudflarestorage.com",
            ForcePathStyle = true
        });

    private void ValidateConfiguration()
    {
        if (string.IsNullOrWhiteSpace(_options.AccountId)
            || string.IsNullOrWhiteSpace(_options.AccessKeyId)
            || string.IsNullOrWhiteSpace(_options.SecretAccessKey)
            || string.IsNullOrWhiteSpace(_options.BucketName)
            || string.IsNullOrWhiteSpace(_options.PublicBaseUrl))
        {
            throw new InvalidOperationException("Cloudflare R2 configuration is incomplete.");
        }
    }
}
