using DLL;
using DLL.Entities;
using Microsoft.EntityFrameworkCore;
using Services.Auth;
using Services.Common;
using Services.Repositories.Interfaces;
using Services.ViewModel;
using System.Linq.Expressions;

namespace Services.Repositories.Implements
{
    public class CategoryRepository : Repository, ICategoryRepository 
    {
        public CategoryRepository(AppDbContext context, IAppContextAccessor accessor) : base(context, accessor)
        {
        }

        public async Task<ServiceModel> CreateOrUpdateCategoryAsync(ServiceModel model)
        {
            if (model.Id.HasValue)
            {
                var entity = await FindAsync<Category>(model.Id.Value);
                entity.CategoryGroupId = model.CategoryId;
                entity.Name = model.Name;
                entity.Time = model.Duration;
                entity.Price = model.Price;


                await UpdateAsync(entity);
            }

            else
            {
                var entity = new Category
                {
                    Id = Guid.NewGuid(),
                    Name = model.Name,
                    Time = model.Duration,
                    Price = model.Price,
                    CategoryGroupId = model.CategoryId
                };
                await AddAsync(entity);
                model.Id = entity.Id;
            }

            return model;
        }

        public async Task<CategoryGroupModel> CreateOrUpdateCategoryGroupAsync(CategoryGroupModel model)
        {
            if (model.Id.HasValue)
            {
                var entity = await FindAsync<CategoryGroup>(model.Id.Value);
                entity.Name = model.Name;
                entity.Description = model.Description;
                await UpdateAsync(entity);
            }

            else
            {
                var entity = new CategoryGroup
                {
                    Name = model.Name,
                    Description = model.Description
                };
                await AddAsync(entity);
                model.Id = entity.Id;
            }

            return model;
        }

        public async Task<GalleryModel> CreateOrUpdateGalleryAsync(GalleryModel model)
        {
            var gallaries = await GetQueryable<Gallery>().ToListAsync();
            foreach (var gallery in gallaries)
            {
                switch (gallery.Name)
                {
                    case "First":
                        gallery.Url = FormatUrl(model.First.Url);
                        gallery.Title = model.First.Title;
                        gallery.SubTitle = model.First.SubTitle;
                        break;
                    case "Second":
                        gallery.Url = FormatUrl(model.Second.Url);
                        gallery.Title = model.Second.Title;
                        gallery.SubTitle = model.Second.SubTitle;

                        break;
                    case "Third":
                        gallery.Url = FormatUrl(model.Third.Url);
                        gallery.Title = model.Third.Title;
                        gallery.SubTitle = model.Third.SubTitle;

                        break;
                    case "Fourth":
                        gallery.Url = FormatUrl(model.Fourth.Url);
                        gallery.Title = model.Fourth.Title;
                        gallery.SubTitle = model.Fourth.SubTitle;

                        break;
                    case "Fifth":
                        gallery.Url = FormatUrl(model.Fifth.Url);
                        gallery.Title = model.Fifth.Title;
                        gallery.SubTitle = model.Fifth.SubTitle;

                        break;
                    case "Sixth":
                        gallery.Url = FormatUrl(model.Sixth.Url);
                        gallery.Title = model.Sixth.Title;
                        gallery.SubTitle = model.Sixth.SubTitle;

                        break;
                    case "Seventh":
                        gallery.Url = FormatUrl(model.Seventh.Url);
                        gallery.Title = model.Seventh.Title;
                        gallery.SubTitle = model.Seventh.SubTitle;

                        break;
                    case "Eighth":
                        gallery.Url = FormatUrl(model.Eighth.Url);
                        gallery.Title = model.Eighth.Title;
                        gallery.SubTitle = model.Eighth.SubTitle;

                        break;
                    case "Panel":
                        gallery.Url = FormatUrl(model.Panel.Url);
                        gallery.Title = model.Panel.Title;
                        gallery.SubTitle = model.Panel.SubTitle;
                        break;

                }
            }

            await UpdateRangeAsync(gallaries);
            return model;
        }

        private string FormatUrl(string url)
        {
            var array = url.Split("files");
            return $"files{array[1]}";
        }

        public async Task DeleteCategoryAsync(Guid id)
        {
            await DeleteAsync<Category>(id);
            return;
        }

        public async Task DeleteCategoryGroupAsync(Guid id)
        {
            await DeleteAsync<CategoryGroup>(id);
            return;
        }

        public async Task<IEnumerable<CategoryGroupModel>> GetAllCategoryGroupAsync()
        {
            Expression<Func<CategoryGroup, CategoryGroupModel>> selector = x => new CategoryGroupModel
            {
                Id = x.Id,
                Name = x.Name,
                Description = x.Description
            };

            return await FindAllAsync(selector);
        }

        public async Task<GalleryModel> GetGalleryAsync()
        {
            var query = GetQueryable<Gallery>().OrderBy(x => x.CreatedAt);
            Expression<Func<Gallery, GalleryItem>> selector = x => new GalleryItem
            {
                Url = x.Url,
                Title = x.Title,
                SubTitle = x.SubTitle,
                Name = x.Name
            };

            var galleries = await FindAllAsync(query, selector);
            var model = new GalleryModel();
            foreach(var gallery in galleries)
            {
                switch (gallery.Name)
                {
                    case "First":
                        model.First = gallery;
                        break;
                    case "Second":
                        model.Second = gallery;
                        break;
                    case "Third":
                        model.Third = gallery;
                        break;
                    case "Fourth":
                        model.Fourth = gallery;
                        break;
                    case "Fifth":
                        model.Fifth = gallery;
                        break;
                    case "Sixth":
                        model.Sixth = gallery;
                        break;
                    case "Seventh":
                        model.Seventh = gallery;
                        break;
                    case "Panel":
                        model.Panel = gallery;
                        break;
                    case "Eighth":
                        model.Eighth = gallery;
                        break;
                }
            }

            return model;
        }

        public async Task<PagedResult<ServiceModel>> GetServicePagedAsync(Guid? categoryId, int? page = 1, int? pageSize = 20)
        {
            var query = GetQueryable<Category>(new string[] { "CategoryGroup" });
            if (categoryId.HasValue)
            {
                query = query.Where(x => x.CategoryGroupId == categoryId);
            }

            Expression<Func<Category, ServiceModel>> selector = x => new ServiceModel
            {
                Id = x.Id,
                Name = x.Name,
                Duration = x.Time,
                Price = x.Price,
                CategoryId = x.CategoryGroupId,
                Description = x.Description,
                CategoryName = x.CategoryGroup.Name
            };

            return await FindPagedAsync(query, selector, page, pageSize);
        }
    }
}
