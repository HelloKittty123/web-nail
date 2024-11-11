using Services.Common;
using Services.ViewModel;

namespace Services.Repositories.Interfaces
{
    public interface IBookingRepository
    {
        Task<IEnumerable<BookingCategoryModel>> GetAllCategoryAsync();

        Task<IEnumerable<UserModel>> GetAllUserAsync();

        Task<Response> CreateBookingAsync(BookingModel model);

        Task<IEnumerable<CalendarModel>> GetCalendarAsync(Guid? staffId, DateTime start, DateTime end);

        Task<IEnumerable<CalendarModel>> GetFullCalendarAsync(Guid? staffId, DateTime start, DateTime end);

        Task UpdateStatusAsync(CalendarUpdateStatus model);

        Task DeleteCalendarAsync(Guid id);

        Task CreateStaffOnLeaveAsync(StaffOnLeaveModel model);

        Task<PagedResult<CustomerModel>> GetCustomerAsync(string? search, int? page = 1, int? pageSize = 20);
    }
}
