using DLL;
using Microsoft.EntityFrameworkCore;
using Services.Auth;
using Services.Common;
using System.Linq.Expressions;

namespace Services.Repositories
{
    /// <summary>
    /// Lớp Repository cung cấp các CRUD cho các thực thể trong cơ sở dữ liệu
    /// </summary>
    public class Repository
    {
        private readonly AppDbContext _context;
        private readonly IAppContextAccessor _accessor;

        // Hàm khởi tạo Repository với tham chiếu đến DbContext và IAppContextAccessor
        public Repository(AppDbContext context, IAppContextAccessor accessor)
        {
            _context = context;
            _accessor = accessor;
        }

        /// <summary>
        /// Thêm một thực thể vào cơ sở dữ liệu
        /// </summary>
        /// <typeparam name="TEntity">Thực thể</typeparam>
        /// <param name="entity">Giá trị thực thể</param>
        /// <returns></returns>
        public async Task<TEntity> AddAsync<TEntity>(TEntity entity) where TEntity : EntityBase
        {
            var userId = _accessor.GetCurrentUserId();
            if (userId != null)
            {
                entity.CreatedBy = userId;
                entity.ModifiedBy = userId;
            }

            entity.IsDeleted = false;
            entity.CreatedAt = DateTime.Now;
            entity.ModifiedAt = DateTime.Now;

            _context.Set<TEntity>().Add(entity);
            await SaveChangeAsync();
            return entity;
        }

        /// <summary>
        /// Thêm nhiều thực thể vào cơ sở dữ liệu
        /// </summary>
        /// <typeparam name="TEntity">Thực thể</typeparam>
        /// <param name="entities">Giá trị thực thể</param>
        /// <returns></returns>
        public async Task AddRangeAsync<TEntity>(IEnumerable<TEntity> entities) where TEntity : EntityBase
        {
            var entityTemps = entities.ToList();
            entityTemps.ForEach(x =>
            {
                x.CreatedBy = _accessor.GetCurrentUserId();
                x.ModifiedBy = _accessor.GetCurrentUserId();
                x.CreatedAt = DateTime.Now;
                x.ModifiedAt = DateTime.Now;
            });

            _context.Set<TEntity>().AddRange(entityTemps);
            await SaveChangeAsync();
        }

        /// <summary>
        /// Xóa cứng - xóa một thực thể khỏi cơ sở dữ liệu
        /// </summary>
        /// <typeparam name="TEntity"></typeparam>
        /// <param name="entity"></param>
        /// <returns></returns>
        public async Task DeleteAsync<TEntity>(TEntity entity) where TEntity : EntityBase
        {
            _context.Set<TEntity>().Remove(entity);
            await SaveChangeAsync();
            return;
        }

        /// <summary>
        /// Xóa cứng - xóa một thực thể khỏi cơ sở dữ liệu bằng Id
        /// </summary>
        /// <typeparam name="TEntity"></typeparam>
        /// <param name="id"></param>
        /// <returns></returns>
        public async Task DeleteAsync<TEntity>(Guid id) where TEntity : EntityBase
        {
            var entity = _context.Set<TEntity>().FirstOrDefault(c => c.Id.Equals(id));
            if (entity != null)
            {
                _context.Set<TEntity>().Remove(entity);
                await SaveChangeAsync();
                return;
            }
        }

        /// <summary>
        /// Xóa cứng - xóa nhiều thực thể khỏi cơ sở dữ liệu bằng danh sách Id
        /// </summary>
        /// <typeparam name="TEntity"></typeparam>
        /// <param name="ids"></param>
        /// <returns></returns>
        public async Task DeleteRangeAsync<TEntity>(IEnumerable<Guid> ids) where TEntity : EntityBase
        {
            var entities = _context.Set<TEntity>().Where(c => ids.Contains(c.Id));
            _context.RemoveRange(entities);
            await SaveChangeAsync();
        }

        /// <summary>
        /// Xóa cứng - xóa nhiều thực thể khỏi cơ sở dữ liệu bằng điều kiện
        /// </summary>
        /// <typeparam name="TEntity"></typeparam>
        /// <param name="where"></param>
        /// <returns></returns>
        public async Task DeleteRangeAsync<TEntity>(Expression<Func<TEntity, bool>> where = null) where TEntity : EntityBase
        {
            var entities = _context.Set<TEntity>().Where(where);
            _context.RemoveRange(entities);
            await SaveChangeAsync();
        }

        /// <summary>
        /// Xóa mềm - một thực thể khỏi cơ sở dữ liệu
        /// </summary>
        /// <typeparam name="TEntity"></typeparam>
        /// <param name="entity"></param>
        /// <returns></returns>
        public async Task<bool> DeleteSoftAsync<TEntity>(TEntity entity) where TEntity : EntityBase
        {
            entity.IsDeleted = true;
            entity.ModifiedAt = DateTime.Now;
            _context.Set<TEntity>().Update(entity);

            return await _context.SaveChangesAsync() > 0;
        }

        /// <summary>
        /// Xóa mềm - xóa một thực thể khỏi cơ sở dữ liệu bằng Id
        /// </summary>
        /// <typeparam name="TEntity"></typeparam>
        /// <param name="id"></param>
        /// <returns></returns>
        public async Task<bool> DeleteSoftAsync<TEntity>(Guid id) where TEntity : EntityBase
        {
            var entity = _context.Set<TEntity>().FirstOrDefault(c => c.Id.Equals(id));
            if (entity != null)
            {
                entity.IsDeleted = true;
                entity.ModifiedAt = DateTime.Now;
                _context.Set<TEntity>().Update(entity);

                return await _context.SaveChangesAsync() > 0;
            }

            return false;
        }

        /// <summary>
        /// Xóa mềm - xóa nhiều thực thể khỏi cơ sở dữ liệu bằng danh sách Id
        /// </summary>
        /// <typeparam name="TEntity"></typeparam>
        /// <param name="ids">Danh sách id</param>
        /// <returns></returns>
        public async Task DeleteRangeSoftAsync<TEntity>(IEnumerable<Guid> ids) where TEntity : EntityBase
        {
            var entities = await _context.Set<TEntity>().Where(c => ids.Contains(c.Id))
                .ToListAsync();
            entities.ForEach(element =>
            {
                element.IsDeleted = true;
            });

            _context.Set<TEntity>().UpdateRange(entities);
            await SaveChangeAsync();
        }

        /// <summary>
        /// Xóa mềm - xóa nhiều thực thể khỏi cơ sở dữ liệu bằng điều kiện
        /// </summary>
        /// <typeparam name="TEntity"></typeparam>
        /// <param name="where"></param>
        /// <returns></returns>
        public async Task DeleteRangeSoftAsync<TEntity>(Expression<Func<TEntity, bool>> where = null) where TEntity : EntityBase
        {
            var entities = await _context.Set<TEntity>().Where(where)
                .ToListAsync();
            entities.ForEach(element => element.IsDeleted = true);
            _context.Set<TEntity>().UpdateRange(entities);
            await SaveChangeAsync();
        }

        /// <summary>
        /// Danh sách tất cả thực thể
        /// </summary>
        /// <typeparam name="TEntity">Entity</typeparam>
        /// <typeparam name="TModel">Model</typeparam>
        /// <param name="where">Điều kiện lọc</param>
        /// <param name="selector">Hàm chuyển đổi</param>
        /// <param name="includes">Các bảng cần join</param>
        /// <returns></returns>
        public async Task<IEnumerable<TModel>> FindAllAsync<TEntity, TModel>(Expression<Func<TEntity, bool>> where = null, Expression<Func<TEntity, TModel>> selector = null, IEnumerable<string> includes = null) where TEntity : EntityBase where TModel : class
        {
            var query = AsQueryable<TEntity>(includes).AsNoTracking();
            if (where != null)
            {
                query = query.Where(where);
            }

            return await query.Select(selector).ToListAsync();
        }

        /// <summary>
        /// Danh thực thể từ một truy vấn cụ thể và chọn kết quả theo một bộ chọn cụ thể
        /// </summary>
        /// <typeparam name="TEntity">Entity</typeparam>
        /// <typeparam name="TModel">Model</typeparam>
        /// <param name="query">IQueryable</param>
        /// <param name="selector">Selector</param>
        /// <returns></returns>
        public async Task<IEnumerable<TModel>> FindAllAsync<TEntity, TModel>(IQueryable<TEntity> query, Expression<Func<TEntity, TModel>> selector = null) where TEntity : EntityBase where TModel : class
        {
            query = query.OrderByDescending(x => x.CreatedAt).AsQueryable();
            return await query.Select(selector).ToListAsync();
        }

        /// <summary>
        /// Danh sách thực thể theo điều kiện
        /// </summary>
        /// <typeparam name="TEntity"></typeparam>
        /// <param name="where"></param>
        /// <returns></returns>
        public async Task<IEnumerable<TEntity>> FindAllAsync<TEntity>(Expression<Func<TEntity, bool>>? where = null) where TEntity : EntityBase
        {
            var query = GetQueryable<TEntity>();
            if (where != null)
            {
                query = query.Where(where);
            }
            return await query.AsNoTracking().ToListAsync();
        }

        /// <summary>
        /// Danh sách thực thể theo điều kiện và bao gồm các thực thể liên quan
        /// </summary>
        /// <typeparam name="TEntity"></typeparam>
        /// <param name="where"></param>
        /// <param name="includes"></param>
        /// <returns></returns>
        public async Task<IEnumerable<TEntity>> FindAllAsync<TEntity>(Expression<Func<TEntity, bool>> where = null, IEnumerable<string>? includes = null) where TEntity : EntityBase
        {
            if (where is null) return await GetQueryable<TEntity>(includes).AsNoTracking().ToListAsync();

            return await GetQueryable<TEntity>(includes).Where(where).AsNoTracking().ToListAsync();
        }

        /// <summary>
        /// Danh sách thực thể và chọn kết quả theo một bộ chọn cụ thể
        /// </summary>
        /// <typeparam name="TModel"></typeparam>
        /// <typeparam name="TEntity"></typeparam>
        /// <param name="selector"></param>
        /// <returns></returns>
        public async Task<IEnumerable<TModel>> FindAllAsync<TModel, TEntity>(Expression<Func<TEntity, TModel>> selector) where TEntity : EntityBase where TModel : class
        {
            var query = GetQueryable<TEntity>().Select(selector);
            return await query.ToListAsync();
        }

        /// <summary>
        /// Tìm kiếm một thực thể theo điều kiện và bao gồm các thực thể liên quan
        /// </summary>
        /// <typeparam name="TEntity"></typeparam>
        /// <param name="where"></param>
        /// <param name="includes"></param>
        /// <returns></returns>
        public async Task<TEntity> FindAsync<TEntity>(Expression<Func<TEntity, bool>> where = null, IEnumerable<string> includes = null) where TEntity : EntityBase
        {
            var query = AsQueryable<TEntity>(includes);
            return await query.Where(where).FirstOrDefaultAsync();
        }

        /// <summary>
        /// Tìm kiếm thực thể đầu tiên trong bảng
        /// </summary>
        /// <typeparam name="TEntity"></typeparam>
        /// <returns></returns>
        public async Task<TEntity> FirstAsync<TEntity>() where TEntity : EntityBase
        {
            var query = _context.Set<TEntity>();
            return await query.FirstOrDefaultAsync();
        }

        /// <summary>
        /// Tìm kiếm một thực thể theo Id và bao gồm các thực thể liên quan
        /// </summary>
        /// <typeparam name="TEntity"></typeparam>
        /// <param name="id"></param>
        /// <param name="includes"></param>
        /// <returns></returns>
        public async Task<TEntity> FindAsync<TEntity>(Guid id, IEnumerable<string> includes = null) where TEntity : EntityBase
        {
            return await AsQueryable<TEntity>(includes)
                .AsNoTracking().FirstOrDefaultAsync(c => c.Id.Equals(id));
        }

        /// <summary>
        /// Tìm kiếm một thực thể theo Id
        /// </summary>
        /// <typeparam name="TEntity"></typeparam>
        /// <param name="id"></param>
        /// <returns></returns>
        public async Task<TEntity> FindAsync<TEntity>(Guid id) where TEntity : EntityBase
        {
            return await AsQueryable<TEntity>()
                .AsNoTracking().FirstOrDefaultAsync(c => c.Id.Equals(id));
        }

        /// <summary>
        /// Tìm kiếm một thực thể theo Id và chọn kết quả theo một bộ chọn cụ thể
        /// </summary>
        /// <typeparam name="TEntity"></typeparam>
        /// <typeparam name="TModel"></typeparam>
        /// <param name="id"></param>
        /// <param name="selector"></param>
        /// <param name="includes"></param>
        /// <returns></returns>
        public async Task<TModel> FindAsync<TEntity, TModel>(Guid id, Expression<Func<TEntity, TModel>> selector, IEnumerable<string> includes = null) where TEntity : EntityBase where TModel : class
        {
            var query = AsQueryable<TEntity>(includes);
            var model = await query.Where(x => x.Id.Equals(id))
                                   .Select(selector)
                                   .AsNoTracking()
                                   .FirstOrDefaultAsync();

            return model;
        }

        /// <summary>
        /// Tìm kiếm thực thể đầu tiên hoặc giá trị mặc định
        /// </summary>
        /// <typeparam name="TEntity"></typeparam>
        /// <returns></returns>
        public async Task<TEntity> FirstOrDefautAynsc<TEntity>() where TEntity : EntityBase
        {
            return await _context.Set<TEntity>().FirstOrDefaultAsync();
        }

        /// <summary>
        /// Tìm kiếm thực thể mới nhất theo ngày tạo
        /// </summary>
        /// <typeparam name="TEntity"></typeparam>
        /// <param name="includes"></param>
        /// <returns></returns>
        public async Task<TEntity> FindNewestAsync<TEntity>(IEnumerable<string> includes) where TEntity : EntityBase
        {
            var query = GetQueryable<TEntity>(includes);
            query = query.OrderByDescending(c => c.CreatedAt);
            return await query.FirstOrDefaultAsync();
        }

        /// <summary>
        /// Lấy truy vấn cho một thực thể
        /// </summary>
        /// <typeparam name="TEntity"></typeparam>
        /// <returns></returns>
        public IQueryable<TEntity> GetQueryable<TEntity>() where TEntity : EntityBase
        {
            return AsQueryable<TEntity>();
        }

        /// <summary>
        /// Cập nhật một thực thể trong cơ sở dữ liệu
        /// </summary>
        /// <typeparam name="TEntity"></typeparam>
        /// <param name="entity"></param>
        /// <returns></returns>
        public async Task<TEntity> UpdateAsync<TEntity>(TEntity entity) where TEntity : EntityBase
        {
            var userId = _accessor.GetCurrentUserId();
            if (userId != null)
            {
                entity.ModifiedBy = userId;
            }

            entity.ModifiedAt = DateTime.Now;
            _context.Set<TEntity>().Update(entity);
            await _context.SaveChangesAsync();
            return entity;
        }

        /// <summary>
        /// Cập nhật nhiều thực thể trong cơ sở dữ liệu
        /// </summary>
        /// <typeparam name="TEntity"></typeparam>
        /// <param name="entites"></param>
        /// <returns></returns>
        public async Task UpdateRangeAsync<TEntity>(IEnumerable<TEntity> entites) where TEntity : EntityBase
        {
            _context.UpdateRange(entites);
            await _context.SaveChangesAsync();
        }

        /// <summary>
        /// Lưu thay đổi vào cơ sở dữ liệu
        /// </summary>
        /// <returns></returns>
        public async Task SaveChangeAsync()
        {
            await _context.SaveChangesAsync();
        }

        /// <summary>
        /// Tạo truy vấn cho một thực thể với các thực thể liên quan
        /// </summary>
        /// <typeparam name="TEntity"></typeparam>
        /// <param name="includes"></param>
        /// <returns></returns>
        private IQueryable<TEntity> AsQueryable<TEntity>(IEnumerable<string> includes = null) where TEntity : EntityBase
        {
            var query = _context.Set<TEntity>()
                                .Where(x => !x.IsDeleted)
                                .OrderByDescending(x => x.CreatedAt)
                                .AsQueryable();

            if (includes?.Any() != true)
            {
                return query;
            }

            foreach (var include in includes)
            {
                query = query.Include(include);
            }

            return query;
        }

        /// <summary>
        /// Lấy truy vấn cho một thực thể với các thực thể liên quan
        /// </summary>
        /// <typeparam name="TEntity">Entity</typeparam>
        /// <param name="includes">Tables</param>
        /// <returns></returns>
        public IQueryable<TEntity> GetQueryable<TEntity>(IEnumerable<string> includes) where TEntity : EntityBase
        {
            var query = GetQueryable<TEntity>();
            if (includes?.FirstOrDefault() != null)
            {
                foreach (var include in includes)
                {
                    query = query.Include(include);
                }
            }

            return query;
        }

        /// <summary>
        /// Đếm số lượng thực thể theo điều kiện
        /// </summary>
        /// <typeparam name="TEntity"></typeparam>
        /// <param name="where"></param>
        /// <returns></returns>
        public async Task<int> CountAsync<TEntity>(Expression<Func<TEntity, bool>> where = null) where TEntity : EntityBase
        {
            var query = GetQueryable<TEntity>();
            if (where != null)
            {
                query = query.Where(where);
            }

            return await query.CountAsync();
        }

        /// <summary>
        /// Tìm kiếm có phân trang và chọn kết quả theo một bộ chọn cụ thể
        /// </summary>
        /// <typeparam name="TEntity"></typeparam>
        /// <typeparam name="TModel"></typeparam>
        /// <param name="query"></param>
        /// <param name="selector"></param>
        /// <param name="page"></param>
        /// <param name="pageSize"></param>
        /// <returns></returns>
        public async Task<PagedResult<TModel>> FindPagedAsync<TEntity, TModel>(IQueryable<TEntity> query, Expression<Func<TEntity, TModel>> selector = null, int? page = 1, int? pageSize = 20)
            where TEntity : EntityBase
            where TModel : class
        {
            var modelQuery = query.Select(selector);
            var count = await modelQuery.CountAsync();
            var items = await modelQuery.Skip((page.Value - 1) * pageSize.Value).Take(pageSize.Value).ToListAsync();

            return new PagedResult<TModel>(items, count, page, pageSize);
        }

        /// <summary>
        /// Tìm kiếm có phân trang
        /// </summary>
        /// <typeparam name="TModel"></typeparam>
        /// <param name="query"></param>
        /// <param name="page"></param>
        /// <param name="pageSize"></param>
        /// <returns></returns>
        public async Task<PagedResult<TModel>> FindPagedAsync<TModel>(IQueryable<TModel> query, int? page = 1, int? pageSize = 15) where TModel : class
        {
            var count = await query.CountAsync();
            var items = await query.Skip((page.Value - 1) * pageSize.Value).Take(pageSize.Value).ToListAsync();

            return new PagedResult<TModel>(items, count, page, pageSize);
        }

        /// <summary>
        /// Tìm kiếm có phân trang và chọn kết quả theo một bộ chọn cụ thể
        /// </summary>
        /// <typeparam name="TEntity"></typeparam>
        /// <typeparam name="TModel"></typeparam>
        /// <param name="where"></param>
        /// <param name="selector"></param>
        /// <param name="page"></param>
        /// <param name="pageSize"></param>
        /// <returns></returns>
        public async Task<PagedResult<TModel>> FindPagedAsync<TEntity, TModel>(Expression<Func<TEntity, bool>> where, Expression<Func<TEntity, TModel>> selector = null, int? page = 1, int? pageSize = 20)
            where TEntity : EntityBase
            where TModel : class
        {
            var query = GetQueryable<TEntity>().Where(where);
            return await FindPagedAsync(query, selector, page, pageSize);
        }

        /// <summary>
        /// Tìm kiếm một thực thể theo Id, 
        /// bao gồm các thực thể liên quan và chọn kết quả theo một bộ chọn cụ thể
        /// </summary>
        /// <typeparam name="TModel"></typeparam>
        /// <typeparam name="TEntity"></typeparam>
        /// <param name="id"></param>
        /// <param name="includes"></param>
        /// <param name="selector"></param>
        /// <returns></returns>
        public async Task<TModel> FindAsync<TModel, TEntity>(Guid id, IEnumerable<string> includes = null, Expression<Func<TEntity, TModel>> selector = null)
            where TModel : class
            where TEntity : EntityBase
        {
            var model = await GetQueryable<TEntity>(includes)
                .Where(x => x.Id.Equals(id))
                .Select(selector).FirstOrDefaultAsync();

            return model;
        }

        /// <summary>
        /// Kiểm tra sự tồn tại của thực thể theo điều kiện
        /// </summary>
        /// <typeparam name="TEntity"></typeparam>
        /// <param name="where"></param>
        /// <returns></returns>
        public async Task<bool> IsExistsAsync<TEntity>(Expression<Func<TEntity, bool>> where) where TEntity : EntityBase
        {
            var query = GetQueryable<TEntity>().Where(where);
            return await query.AnyAsync();
        }
    }
}