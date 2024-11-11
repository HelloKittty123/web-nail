using System.ComponentModel.DataAnnotations.Schema;

namespace DLL.Entities
{
    [Table("CategoryGroups")]
    public class CategoryGroup : EntityBase
    {
        public string Name { get; set; } = string.Empty;

        public virtual ICollection<Category> Categories { get; set; }

        public string Description { get; set; }
    }
}
