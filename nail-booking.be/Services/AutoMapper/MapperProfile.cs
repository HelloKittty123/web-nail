using AutoMapper;
using DLL.Entities;
using DLL.ViewModels;

namespace Services.AutoMapper
{
    public class MapperProfile : Profile
    {
        public MapperProfile()
        {
            CreateMap<User, UserViewModel>();
            CreateMap<UserViewModel, User>();
        }
    }
}
