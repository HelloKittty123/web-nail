namespace DLL.Constants
{
    public static class ConstantErrorCode
    {
        /// <summary>
        /// Thành công
        /// </summary>
        public const int Success = 0;

        /// <summary>
        /// Không tìm thấy tài khoản
        /// </summary>
        public const int UserNotFound = 1;

        /// <summary>
        /// Người dùng bị khóa
        /// </summary>
        public const int UserIsLocked = 2;

        /// <summary>
        /// Người dùng chưa được kích hoạt
        /// </summary>
        public const int UserIsNotActive = 3;
    }
}
