namespace DLL.ViewModels
{
    /// <summary>
    /// Represents a view model for a user.
    /// </summary>
    public class UserViewModel
    {
        public Guid Id { get; set; }

        public int Status { get; set; }

        public string UserName { get; set; }

        public string Email { get; set; }

        public string Avatar { get; set; }

        public DateTime? Birthday { get; set; }

        public int Gender { get; set; }

        public string Name { get; set; }

        public string Password { get; set; }

        public string Address { get; set; }

        public string Phone { get; set; }

        public string Mobile { get; set; }

        public string Yahoo { get; set; }

        public string Skype { get; set; }

        public string Facebook { get; set; }

        public string Detail { get; set; }

        public string Skin { get; set; }

        public DateTime? LastLogin { get; set; }

        public Guid? ParrentId { get; set; }

        public Guid? CompanyId { get; set; }

        public bool IsRootAdmin { get; set; }
    }


}

