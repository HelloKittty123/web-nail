using System.ComponentModel;

namespace DLL.Enum
{
    public enum EnumRole
    {
        [Description("Quản trị hệ thống")]
        Admin = 1,

        [Description("Nhân viên")]
        Employee = 2
    }
}
