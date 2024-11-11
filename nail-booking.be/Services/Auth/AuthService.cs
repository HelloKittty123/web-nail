using DLL.Constants;
using DLL.ViewModels;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using Services.Auth.Dtos;
using Services.Common;
using Services.Helper;
using Services.Options;
using Services.Repositories.Interfaces;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace Services.Auth
{
    public interface IAuthService
    {
        /// <summary>
        /// Đăng nhập hệ thống
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        Task<Response> AuthAsync(LoginRequest model);
    }

    public class AuthService : IAuthService
    {
        private readonly IUserRepository _userRepository;
        private readonly ICryptorFactory _cryptorFactory;
        private readonly ILogger<AuthService> _logger;
        private readonly AppSetting _setting;

        public AuthService(IUserRepository userRepository,
            ICryptorFactory cryptorFactory,
            IOptions<AppSetting> setting,
            ILogger<AuthService> logger)
        {
            _userRepository = userRepository;
            _cryptorFactory = cryptorFactory;
            _logger = logger;
            _setting = setting.Value;
        }

        /// <summary>
        /// Đăng nhập hệ thống
        /// </summary>
        /// <param name="model">Thông tin đăng nhập</param>
        /// <returns></returns>
        public async Task<Response> AuthAsync(LoginRequest model)
        {
            var user = await _userRepository.GetByUserNameAsync(model.UserName);

            /// Người dùng không tồn tại
            if(user is null) return Response.Fail("Tài khoản không tồn tại",ConstantErrorCode.UserNotFound);

            /// Mật khẩu không chính xác
            if(!CheckPassword(model.Password, user.Password)) return Response.Fail("Mật khẩu không chính xác");

            user.Password = string.Empty;

            _logger.LogInformation($"User {user.UserName} đã đăng nhập.");


            return Response.Success(new
            {
                Token = GenerateJwt(user),
                User = user
            });
        }

        /// <summary>
        /// Kiểm tra mật khẩu
        /// </summary>
        /// <param name="password"></param>
        /// <param name="hashPassword"></param>
        /// <returns></returns>
        private bool CheckPassword(string password, string hashPassword)
        {
            string hasedPassword = _cryptorFactory.ToHashPassword(password);

            return hasedPassword.Equals(hashPassword);
        }

        /// <summary>
        /// Tạo mã đăng nhập
        /// </summary>
        /// <param name="user"></param>
        /// <returns></returns>
        private string GenerateJwt(UserViewModel user)
        {
            var claims = new List<Claim>
            {
                 new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                 new Claim(ClaimTypes.Name, user.UserName),
                 new Claim("IsRootAdmin",user.IsRootAdmin.ToString().ToLower()),
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_setting.Token));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha512Signature);
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.Now.AddDays(1),
                SigningCredentials = creds
            };

            var tokenHandler = new JwtSecurityTokenHandler();
            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }
    }
}
