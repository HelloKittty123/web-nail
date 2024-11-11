using AutoMapper;
using DLL;
using DLL.Entities;
using DLL.ViewModels;
using Services.Auth;
using Services.Common;
using Services.Helper;
using Services.Repositories.Interfaces;
using Services.ViewModel;
using System.Linq.Expressions;

namespace Services.Repositories.Implements
{
    /// <summary>
    /// Repository for user
    /// </summary>
    public class UserRepository : Repository, IUserRepository
    {
        private readonly ICryptorFactory cryptor;
        private readonly IMapper _mapper;

        public UserRepository(AppDbContext context,
            IAppContextAccessor accessor,
            ICryptorFactory cryptor,
            IMapper mapper) : base(context, accessor)
        {
            this.cryptor = cryptor;
            _mapper = mapper;
        }

        public async Task<UserModel> CreateUserAsync(UserModel model)
        {
            var user = new User()
            {
                Id = Guid.NewGuid(),
                Avatar = model.Avatar,
                Name = model.Name,
                Password = cryptor.ToHashPassword(model.Password),
                Position = model.Position,
            };

            if (string.IsNullOrEmpty(user.Avatar)) user.Avatar = "default.jpg";

            await AddAsync(user);

            return model;
        }

        public async Task DeleteUserAsync(Guid id)
        {
            var entity = await FindAsync<User>(id);
            if (entity != null)
            {
                entity.IsDeleted = true;
                await UpdateAsync(entity);
            }
        }

        public async Task<IEnumerable<UserModel>> GetAllUserAsync()
        {
            Expression<Func<User, UserModel>> selector = x => new UserModel
            {
                Id = x.Id,
                UserName = x.UserName,
                Avatar = x.Avatar,
                Name = x.Name,
                Position = x.Position
            };

            return await FindAllAsync(GetQueryable<User>(), selector);
        }

        /// <summary>
        /// Tìm kiếm người dùng theo tên đăng nhập
        /// </summary>
        /// <param name="userName"></param>
        /// <returns></returns>
        public async Task<UserViewModel> GetByUserNameAsync(string userName)
        {
            var user = await FindAsync<User>(x => x.UserName.ToLower().Equals(userName.ToLower()));
            if (user is null) return default;

            return _mapper.Map<UserViewModel>(user);
        }

        public async Task<PagedResult<UserModel>> GetUserPagingAsync(int? page = 1, int? pageSize = 20)
        {
            Expression<Func<User, UserModel>> selector = x => new UserModel
            {
                Id = x.Id,
                UserName = x.UserName,
                Avatar = x.Avatar ?? "default.jpg",
                Name = x.Name,
                Position = x.Position,
            };

            return await FindPagedAsync(GetQueryable<User>().Where(x => !x.IsDeleted), selector, page, pageSize);
        }

        public async Task<UserModel> UpdateUserAsync(UserModel model)
        {
            var entity = await FindAsync<User>(model.Id.Value);
            if (entity != null)
            {
                entity.Name = model.Name;
                entity.Position = model.Position;
                if (!string.IsNullOrEmpty(entity.Avatar))
                {
                    var images = model.Avatar.Split("files");

                    entity.Avatar = $"files{images[images.Length - 1]}";
                }

                if (!string.IsNullOrEmpty(model.Password))
                    entity.Password = cryptor.ToHashPassword(model.Password);

                await UpdateAsync(entity);

                return model;
            }

            return default;




        }
    }
}
