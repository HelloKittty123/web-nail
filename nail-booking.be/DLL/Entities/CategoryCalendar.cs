using System.ComponentModel.DataAnnotations.Schema;

namespace DLL.Entities
{
    [Table("CategoryCalendars")]
    public class CategoryCalendar : EntityBase
    {
        public Guid CategoryId { get; set; }

        [ForeignKey(nameof(CategoryId))]
        public virtual Category Category { get; set; }

        public Guid CalendarId { get; set; }

        [ForeignKey(nameof(CalendarId))]
        public virtual Calendar Calendar { get; set; }
    }
}
