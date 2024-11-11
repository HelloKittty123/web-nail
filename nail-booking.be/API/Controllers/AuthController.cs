using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Services.Auth;
using Services.Auth.Dtos;

namespace API.Controllers
{
    public class AuthController : BaseController
    {
        private readonly IAuthService _service;

        public AuthController(IAuthService service)
        {
            _service = service;
        }

        /// <summary>
        /// Đăng nhập hệ thống
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        [AllowAnonymous]
        [HttpPost("auth")]
        public async Task<IActionResult> Auth([FromBody] LoginRequest model)
        {
            var response = await _service.AuthAsync(model);

            if (response is null) return BadRequest();

            return Ok(response);
        }
    }
}
