using DLL.Entities;
using DLL.ViewModels;
using Services.Common;
using Services.ViewModel;

namespace Services.Repositories.Interfaces
{
    public interface IUserRepository
    {
        /// <summary>
        /// Chi tiết người dùng theo tên đăng nhập
        /// </summary>
        /// <param name="userName">Tên đăng nhập</param>
        /// <returns></returns>
        Task<UserViewModel> GetByUserNameAsync(string userName);

        Task<PagedResult<UserModel>> GetUserPagingAsync(int? page = 1, int? pageSize = 20);

        Task<IEnumerable<UserModel>> GetAllUserAsync(); 

        Task<UserModel> CreateUserAsync(UserModel model);

        Task<UserModel> UpdateUserAsync(UserModel model);

        Task DeleteUserAsync(Guid id);
    }
}
