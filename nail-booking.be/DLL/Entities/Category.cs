using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace DLL.Entities
{
    [Table("Categories")]
    public class Category : EntityBase
    {
        [StringLength(200)]
        public string Name { get; set; } = string.Empty;

        public decimal Time { get; set; } = 0;

        public decimal Price { get; set; } = 0;

        public Guid CategoryGroupId { get; set; }

        [ForeignKey(nameof(CategoryGroupId))]
        public virtual CategoryGroup CategoryGroup { get; set; }

        public string? Description { get; set; }
    }
}
