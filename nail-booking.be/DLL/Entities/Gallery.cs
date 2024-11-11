using System.ComponentModel.DataAnnotations;

namespace DLL.Entities
{
    public class Gallery : EntityBase
    {
        public int Order { get; set; }

        [StringLength(200)]
        public string Name { get; set; }

        [StringLength(200)]
        public string Url { get; set; }

        [StringLength(200)]
        public string Title { get; set; }

        [StringLength(200)]
        public string SubTitle { get; set; }
    }
}
