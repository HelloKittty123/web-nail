using System.ComponentModel.DataAnnotations;

namespace DLL.Entities
{
    public class Customer : EntityBase
    {
        [StringLength(255)]
        public string Name { get; set; } = string.Empty;

        [StringLength(255)]
        public string Phone { get; set; } = string.Empty;

        [StringLength(255)]
        public string Email { get; set; } = string.Empty;

        public virtual ICollection<Calendar> Calendars { get; set; } = null;

        public DateTime BookingDate { get; set; }
    }
}
