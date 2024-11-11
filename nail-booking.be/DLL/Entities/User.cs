using DLL.Enum;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace DLL.Entities
{
    /// <summary>
    /// Lớp biểu diễn thông tin người dùng trong hệ thống.
    /// </summary>
    [Table("Users")]
    public class User : EntityBase
    {
        [StringLength(200)]
        public string Name { get; set; } = string.Empty;

        [StringLength(200)]
        public EnumRole Role { get; set; } = EnumRole.Admin;

        [StringLength(100)]
        public string UserName { get; set; } = string.Empty;

        public string? Position { get; set; }

        public string Password { get; set; } = string.Empty;

        public string? Avatar { get; set; } = string.Empty;

        /// <summary>
        /// Admin chính
        /// </summary>
        public bool IsRootAdmin { get; set; } = false;
    }
}
