using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Services.Repositories.Interfaces;
using Services.ViewModel;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BookingController : BaseController
    {
        private readonly IBookingRepository _repository;

        public BookingController(IBookingRepository repository)
        {
            _repository = repository;
        }

        [AllowAnonymous]
        [HttpGet("category")]
        public async Task<IActionResult> GetAllCategoryAsync()
        {
            var result = await _repository.GetAllCategoryAsync();
            return Ok(result);
        }

        [AllowAnonymous]
        [HttpGet("users")]
        public async Task<IActionResult> GetAllUserAsync()
        {
            var result = await _repository.GetAllUserAsync();
            return Ok(result);
        }

        [AllowAnonymous]
        [HttpPost("create")]
        public async Task<IActionResult> CreateBookingAsync([FromBody] BookingModel model)
        {
            var result = await _repository.CreateBookingAsync(model);
            return Ok(result);
        }

        [AllowAnonymous]
        [HttpGet("get-calendar")]
        public async Task<IActionResult> GetCalendar([FromQuery] Guid? staffId, [FromQuery] DateTime start, DateTime end)
        {
            var response = await _repository.GetCalendarAsync(staffId,start, end);
            return Ok(response);
        }

        [HttpGet("get-full-calendar")]
        public async Task<IActionResult> GetFullCalendar([FromQuery] Guid? staffId, [FromQuery] DateTime start, DateTime end)
        {
            var response = await _repository.GetFullCalendarAsync(staffId, start, end);
            return Ok(response);
        }

        [HttpPut("update-status")]
        public async Task<IActionResult> UpdateStatus([FromBody] CalendarUpdateStatus model)
        {
            await _repository.UpdateStatusAsync(model);
            return Ok();
        }

        [HttpDelete("delete-calendar/{id}")]
        public async Task<IActionResult> DeleteCalendar(Guid id)
        {
            await _repository.DeleteCalendarAsync(id);
            return Ok();
        }

        [HttpPost("create-staff-on-leave")]
        public async Task<IActionResult> CreateStaffOnLeave([FromBody] StaffOnLeaveModel model)
        {
            await _repository.CreateStaffOnLeaveAsync(model); 
            return Ok();
        }

        [HttpGet("customer-paging")]
        public async Task<IActionResult> GetCustomerPaging([FromQuery] string? search = null, [FromQuery] int? page = 1, [FromQuery] int? pageSize = 20)
        {
            var response = await _repository.GetCustomerAsync(search, page, pageSize);
            return Ok(response);
        }
    }
}
