using Microsoft.AspNetCore.Builder;
using Services.Auth;
using Services.Helper;
using Microsoft.Extensions.DependencyInjection;
using Services.Repositories.Interfaces;
using Services.Repositories.Implements;

namespace Services
{
    public static class ServiceHelper
    {
        /// <summary>
        /// Đăng ký DI hệ thống
        /// </summary>
        /// <param name="builder"></param>
        public static void Registers(this WebApplicationBuilder builder)
        {
            builder.Services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());
            builder.Services.AddScoped<ICryptorFactory, CryptorFactory>();
            builder.Services.AddScoped<IAppContextAccessor, AppContextAccessor>();
            builder.Services.AddScoped<IUserRepository, UserRepository>();

            builder.Services.AddScoped<IAuthService, AuthService>();
            builder.Services.AddScoped<IBookingRepository, BookingRepository>();
            builder.Services.AddScoped<ICategoryRepository, CategoryRepository>();
        }

    }
}
