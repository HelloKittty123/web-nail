using Services.Common;
using Services.ViewModel;

namespace Services.Repositories.Interfaces
{
    public interface ICategoryRepository
    {
        Task<IEnumerable<CategoryGroupModel>> GetAllCategoryGroupAsync();

        Task<CategoryGroupModel> CreateOrUpdateCategoryGroupAsync(CategoryGroupModel model);

        Task DeleteCategoryGroupAsync(Guid id);

        Task<PagedResult<ServiceModel>> GetServicePagedAsync(Guid? categoryId, int? page = 1, int? pageSize = 20);

        Task<ServiceModel> CreateOrUpdateCategoryAsync(ServiceModel model);

        Task DeleteCategoryAsync(Guid id);

        Task<GalleryModel> GetGalleryAsync();

        Task<GalleryModel> CreateOrUpdateGalleryAsync(GalleryModel model);
    }
}
