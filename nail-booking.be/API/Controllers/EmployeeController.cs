using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Services.Helper;
using Services.Repositories.Interfaces;
using Services.ViewModel;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EmployeeController : ControllerBase
    {
        private readonly IUserRepository _repository;

        public EmployeeController(IUserRepository repository)
        {
            _repository = repository;
        }

        [HttpGet("get-all-paging")]
        public async Task<IActionResult> GetAllPaging([FromQuery] int? page = 1, [FromQuery] int? pageSize = 20)
        {
            var response = await _repository.GetUserPagingAsync(page, pageSize);
            return Ok(response);
        }

        [HttpGet("get-all")]
        public async Task<IActionResult> GetAllEmployee()
        {
            var response = await _repository.GetAllUserAsync();
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
                var url = await FileHelper.ToUploadAsync(file, "avatar");
                return Ok( new
                {
                    data = url
                });
            }
            
            return Ok(string.Empty);
        }

        [HttpPost("create")]
        public async Task<IActionResult> CreateEmployee([FromBody] UserModel model)
        {
            var response = await _repository.CreateUserAsync(model);
            return Ok(response);
        }

        [HttpDelete("delete/{id}")]
        public async Task<IActionResult> DeleteEmployee(Guid id)
        {
            await _repository.DeleteUserAsync(id);
            return Ok();
        }

        [HttpPut("update")]
        public async Task<IActionResult> UpdateEmployee([FromBody] UserModel model)
        {
            var response = await _repository.UpdateUserAsync(model);
            return Ok(response);
        }
    }
}
