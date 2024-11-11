using DLL.Enum;

namespace Services.ViewModel
{
    public class CalendarModel
    {
        public Guid? Id { get; set; }

        public string Name { get; set; }

        public DateTime Start { get; set; }

        public DateTime End { get; set; }

        public Guid StarffId { get; set; }

        public string CustomerName { get; set; }

        public string? CustomerPhone { get; set; }

        public string? CustomerEmail { get; set; }

        public string StaffName { get; set; }

        public List<string> ServiceNames { get; set; }

        public EnumCalendarStatus Status { get; set; }
    }

    public class CalendarUpdateStatus
    {
        public Guid Id { get; set; }

        public EnumCalendarStatus Status { get; set; }
    }

    public class StaffOnLeaveModel
    {
        public Guid StaffId { get; set; }

        public DateTime FromDate { get; set; }

        public DateTime ToDate { get; set; }
    }
}
