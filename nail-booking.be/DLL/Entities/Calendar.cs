using DLL.Enum;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace DLL.Entities
{
    [Table("Calendars")]
    public class Calendar : EntityBase
    {
        [StringLength(2000)]
        public string Name { get; set; } = string.Empty;

        public DateTime Start { get; set; }

        public DateTime End { get; set; }

        public Guid UserId { get; set; }

        [ForeignKey(nameof(UserId))]
        public virtual User User { get; set; }

        [StringLength(255)]
        public string CustomerName { get; set; } = string.Empty;

        [StringLength(63)]
        public string CustomerPhone { get; set; } = string.Empty;

        [StringLength(127)]
        public string CustomerEmail { get; set; } = string.Empty;

        public Guid? CustomerId { get; set; }

        [ForeignKey(nameof(CustomerId))]
        public virtual Customer? Customer { get; set; }

        public virtual ICollection<CategoryCalendar> CategoryCalendars { get; set; }

        public EnumCalendarStatus Status { get; set; }
    }
}
