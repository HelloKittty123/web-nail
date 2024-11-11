using DLL;
using DLL.Entities;
using DLL.Enum;
using Microsoft.EntityFrameworkCore;
using Services.Auth;
using Services.Common;
using Services.Repositories.Interfaces;
using Services.ViewModel;
using System.Linq.Expressions;

namespace Services.Repositories.Implements
{
    public class BookingRepository : Repository, IBookingRepository
    {
        public BookingRepository(AppDbContext context, IAppContextAccessor accessor) : base(context, accessor)
        {
        }

        public async Task<Response> CreateBookingAsync(BookingModel model)
        {
            var calendar = new Calendar
            {
                Id = Guid.NewGuid(),
                Start = model.Start,
                CustomerName = model.CustomerName,
                CustomerPhone = model.CustomerPhone ?? string.Empty,
                UserId = model.StaffId,
                CustomerEmail = model.CustomerEmail ?? string.Empty,
            };

            calendar.End = model.Start.AddMinutes((double)model.Categories.Sum(x => x.Time));
            calendar.Name = $"{calendar.Start.ToString("HH:mm")} - {calendar.End.ToString("HH:mm")} {model.StaffName}";

            //var isExist = await GetQueryable<Calendar>().AnyAsync(x => calendar.Start < x.End
            //&& calendar.End > x.Start
            //&& x.UserId == calendar.UserId
            //&& (x.Status.Equals(EnumCalendarStatus.Approved) || x.Status.Equals(EnumCalendarStatus.StaffOnleave)));
            //if (isExist) return Response.Fail("Staff is busy");

            await AddAsync(calendar);

            var categoryCalendars = model.Categories.Select(d => new CategoryCalendar
            {
                Id = Guid.NewGuid(),
                CategoryId = d.Id,
                CalendarId = calendar.Id,
            });

            await AddRangeAsync(categoryCalendars);

            var customer = new Customer
            {
                Id = Guid.NewGuid(),
                Name = model.CustomerName,
                Phone = model.CustomerPhone,
                Email = model.CustomerEmail,
                BookingDate = model.BookingTime ?? DateTime.Now,
            };

            await AddAsync(customer);

            model.Id = calendar.Id;

            return Response.Success();
        }

        public async Task CreateStaffOnLeaveAsync(StaffOnLeaveModel model)
        {
            var staff = await FindAsync<User>(model.StaffId);
            var calendar = new Calendar
            {
                Id = Guid.NewGuid(),
                Start = model.FromDate.Date,
                End = model.ToDate,
                UserId = model.StaffId,
                Name = $"{staff.Name} On leave",
                Status = EnumCalendarStatus.StaffOnleave
            };

            await AddAsync(calendar);
        }

        public async Task DeleteCalendarAsync(Guid id)
        {
            await DeleteAsync<Calendar>(id);
        }

        public async Task<IEnumerable<BookingCategoryModel>> GetAllCategoryAsync()
        {
            var data = await FindAllAsync<CategoryGroup>(null, new string[] { "Categories" });
            return data.Select(x => new BookingCategoryModel
            {
                Id = x.Id,
                Name = x.Name,
                Description = x.Description,
                Items = x.Categories.Select(c => new BookingCategoryItemModel
                {
                    Id = c.Id,
                    Name = c.Name,
                    Price = c.Price,
                    Time = c.Time,
                    CategoryGroupId = c.CategoryGroupId
                })
            });
        }

        public async Task<IEnumerable<UserModel>> GetAllUserAsync()
        {
            var data = await FindAllAsync<User>(null);
            return data.Select(x => new UserModel
            {
                Id = x.Id,
                Name = x.Name,
                Position = x.Position,
                Avatar = x.Avatar
            });
        }

        public async Task<IEnumerable<CalendarModel>> GetCalendarAsync(Guid? staffId, DateTime start, DateTime end)
        {
            var from = start.Date;
            var to = end.Date.AddDays(1);
            var query = GetQueryable<Calendar>()
                .Where(x => x.Start >= from && x.End <= to);
            if (staffId.HasValue) query = query.Where(x => x.UserId == staffId);

            Expression<Func<Calendar, CalendarModel>> expression = x => new CalendarModel
            {
                Name = x.Name,
                Start = x.Start,
                End = x.End,
            };

            return await FindAllAsync(query, expression);
        }

        public async Task<PagedResult<CustomerModel>> GetCustomerAsync(string? search, int? page = 1, int? pageSize = 20)
        {
            var query = GetQueryable<Customer>();

            Expression<Func<Customer, CustomerModel>> selector = x => new CustomerModel
            {
                Id = x.Id,
                Name = x.Name,
                Email = x.Email,
                Phone = x.Phone,
                BookingDate = x.BookingDate
            };

            return await FindPagedAsync(query, selector, page, pageSize);
        }

        public async Task<IEnumerable<CalendarModel>> GetFullCalendarAsync(Guid? staffId, DateTime start, DateTime end)
        {
            var query = GetQueryable<Calendar>(new string[] { "CategoryCalendars", "CategoryCalendars.Category", "User" })
                .Where(x => x.Start >= start && x.End <= end);

            if (staffId.HasValue) query = query.Where(x => x.UserId == staffId);

            Expression<Func<Calendar, CalendarModel>> expression = x => new CalendarModel()
            {
                CustomerEmail = x.CustomerEmail,
                CustomerName = x.CustomerName,
                CustomerPhone = x.CustomerPhone,
                Start = x.Start,
                End = x.End,
                Name = x.Name,
                StaffName = x.User.Name,
                StarffId = x.UserId,
                Status = x.Status,
                ServiceNames = x.CategoryCalendars.Select(c => c.Category.Name).ToList(),
                Id = x.Id
            };

            return await FindAllAsync(query, expression);
        }

        public async Task UpdateStatusAsync(CalendarUpdateStatus model)
        {
            var entity = await FindAsync<Calendar>(model.Id);
            if (entity is null) return;
            entity.Status = model.Status;
            await UpdateAsync(entity);
            return;
        }
    }
}
