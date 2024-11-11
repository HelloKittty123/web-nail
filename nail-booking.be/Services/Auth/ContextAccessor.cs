using Microsoft.AspNetCore.Http;
using System.Security.Claims;

namespace Services.Auth
{
    public interface IAppContextAccessor
    {
        /// <summary>
        /// Id người dùng đang đăng nhập
        /// </summary>
        /// <returns></returns>
        Guid? GetCurrentUserId();

        /// <summary>
        /// Địa chỉ Ip đang sử dụng
        /// </summary>
        /// <returns></returns>
        string GetIpAddress();
        
        /// <summary>
        /// Tên người dùng đang đăng nhập
        /// </summary>
        /// <returns></returns>
        string GetUserFullName();
        
        /// <summary>
        /// Người dùng hiện tại có phải admin không?
        /// </summary>
        /// <returns></returns>
        bool IsRootAdmin();
    }
    public class AppContextAccessor : IAppContextAccessor
    {
        private readonly IHttpContextAccessor _context;

        public AppContextAccessor(IHttpContextAccessor context)
        {
            _context = context;
        }

        /// <summary>
        /// Id người dùng đang đăng nhập
        /// </summary>
        /// <returns></returns>
        public Guid? GetCurrentUserId()
        {
            var claim = _context.HttpContext.User.Claims.FirstOrDefault(c => c.Type.Equals(ClaimTypes.NameIdentifier));
            if (claim == null)
            {
                return Guid.Empty;
            }

            return Guid.Parse(claim.Value);
        }

        /// <summary>
        /// Địa chỉ IP đăng nhập
        /// </summary>
        /// <returns></returns>
        public string GetIpAddress() => _context?.HttpContext?.Connection?.RemoteIpAddress?.ToString() ?? string.Empty;


        /// <summary>
        /// Tên người dùng đang đăng nhập
        /// </summary>
        /// <returns></returns>
        public string GetUserFullName()
        {
            var claim = _context.HttpContext?.User?
                .Claims?.FirstOrDefault(c => c.Type.Equals("FullName"));
            if (claim == null)
            {
                return "Quản trị";
            }

            return claim.Value;
        }

        /// <summary>
        /// Kiểm tra người dùng có phải admin không?
        /// </summary>
        /// <returns></returns>
        public bool IsRootAdmin()
        {
            var claim = _context.HttpContext?.User?
                .Claims?.FirstOrDefault(c => c.Type.Equals("IsAdmin"));
            if (claim == null)
            {
                return false;
            }

            return bool.Parse(claim.Value);
        }
    }
}
