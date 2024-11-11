using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Services.Helper;
using Services.Repositories.Interfaces;
using Services.ViewModel;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CategoryController : BaseController
    {
        private readonly ICategoryRepository _repository;

        public CategoryController(ICategoryRepository repository)
        {
            _repository = repository;
        }

        [HttpGet("get-all-group")]
        public async Task<IActionResult> GetAllGroup()
        {
            var response = await _repository.GetAllCategoryGroupAsync();

            return Ok(response);
        }

        [HttpPost("create-or-update-group")]
        public async Task<IActionResult> CreateOrUpdateGroup([FromBody] CategoryGroupModel model)
        {
            var response = await _repository.CreateOrUpdateCategoryGroupAsync(model);

            return Ok(response);
        }

        [HttpDelete("delete-group/{id}")]
        public async Task<IActionResult> DeleteGroup(Guid id)
        {
            await _repository.DeleteCategoryGroupAsync(id);
            return Ok();
        }

        [HttpGet("category-paging")]
        public async Task<IActionResult> GetCategoryPaging([FromQuery] Guid? categoryId = null, [FromQuery] int? page = 1, [FromQuery] int? pageSize = 20)
        {
            var response = await _repository.GetServicePagedAsync(categoryId,page,pageSize);
            return Ok(response);
        }

        [HttpPost("create-or-update-category")]
        public async Task<IActionResult> CreateOrUpdateCategory([FromBody] ServiceModel model)
        {
            var response = await _repository.CreateOrUpdateCategoryAsync(model);
            return Ok(response);
        }

        [HttpDelete("delete-category/{id}")]
        public async Task<IActionResult> DeleteCategory(Guid id)
        {
            await _repository.DeleteCategoryAsync(id);
            return Ok();
        }

        [AllowAnonymous]
        [HttpGet("gallery")]
        public async Task<IActionResult> GetGallery()
        {
            var response = await _repository.GetGalleryAsync();
            return Ok(response);
        }

        /// <summary>
        /// upload file
        /// </summary>
        /// <returns></returns>
        [HttpPost("upload-file")]
        public async Task<IActionResult> UploadFile()
        {
            var file = Request.Form.Files.FirstOrDefault();
            if (file != null)
            {
                var url = await FileHelper.ToUploadAsync(file, "gallery");
                return Ok(new
                {
                    data = url
                });
            }

            return Ok(string.Empty);
        }

        [HttpPost("gallery")]
        public async Task<IActionResult> UpdateGallery([FromBody] GalleryModel model)
        {
            await _repository.CreateOrUpdateGalleryAsync(model);
            return Ok();
        }

    }
}
