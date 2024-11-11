using Microsoft.AspNetCore.Http;

namespace Services.Helper
{
    public static class FileHelper
    {
        public static async Task<string> ToUploadAsync(this IFormFile file, string folder)
        {
            var ext = Path.GetExtension(file.FileName);

            string fileName = Guid.NewGuid().ToString().Replace("-", "");

            var folderPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", folder);

            if (!File.Exists(folderPath))
            {
                Directory.CreateDirectory(folderPath);
            }

            var filePath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", folder, $"{fileName}{ext}");
            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
                return $"files/{folder}/{fileName}{ext}";
            }

        }
    }
}
