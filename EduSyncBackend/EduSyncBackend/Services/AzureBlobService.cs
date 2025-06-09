using Azure.Storage.Blobs;
using Microsoft.AspNetCore.Http;
using System.Threading.Tasks;

namespace EduSyncBackend.Services
{
    public class AzureBlobService
    {
        private readonly BlobContainerClient _containerClient;

        public AzureBlobService(IConfiguration config)
        {
            var connStr = config["BlobStorage:ConnectionString"];
            var containerName = config["BlobStorage:ContainerName"];
            _containerClient = new BlobContainerClient(connStr, containerName);
        }

        public async Task<string> UploadFileAsync(IFormFile file)
        {
            var blobClient = _containerClient.GetBlobClient(file.FileName);
            using (var stream = file.OpenReadStream())
            {
                await blobClient.UploadAsync(stream, overwrite: true);
            }
            return blobClient.Uri.ToString();
        }
    }
}
