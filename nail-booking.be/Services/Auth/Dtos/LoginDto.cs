using DLL.ViewModels;

namespace Services.Auth.Dtos
{
    public class LoginRequest
    {
        /// <summary>
        /// Tên người dùng
        /// </summary>
        public string UserName { get; set; }

        /// <summary>
        /// Mật khẩu
        /// </summary>
        public string Password { get; set; }
    }

    public class LoginResponse
    {
        /// <summary>
        /// JWT Token
        /// </summary>
        public string AccessToken { get; set; }

        /// <summary>
        /// Thời gian hết hạn token
        /// </summary>
        public DateTime ExpiredAt { get; set; }

        /// <summary>
        /// Thông tin người dùng
        /// </summary>
        public UserViewModel UserInfo { get; set; }
    }

    
}
