namespace Services.ViewModel
{
    public class BookingCategoryModel
    {
        public Guid Id { get; set; }

        public string Name { get; set; }

        public string Description { get; set; }

        public IEnumerable<BookingCategoryItemModel> Items { get; set; }
    }

    public class BookingCategoryItemModel
    {
        public Guid Id { get; set; }

        public string Name { get; set; }

        public decimal Time { get; set; }

        public decimal Price { get; set; }

        public Guid CategoryGroupId { get; set; }
    }

    public class UserModel
    {
        public Guid? Id { get; set; }

        public string Name { get; set; }
        
        public string? Position { get; set; }

        public string? Avatar { get; set; }

        public string? UserName { get; set; }

        public string? Password { get; set; }

    }

    public class BookingModel
    {
        public Guid? Id { get; set; }

        public IEnumerable<BookingCategoryItemModel> Categories { get; set; }

        public decimal TotalQuantity { get; set; }

        public decimal TotalAmount { get; set; }

        public Guid StaffId { get; set; }

        public string CustomerName { get; set; }

        public string? CustomerPhone { get; set; }

        public string? CustomerEmail { get; set; }

        public DateTime Start { get; set; }

        public string? CategoryName { get; set; }

        public string? StaffName { get; set; }

        public DateTime? BookingTime { get; set; }
    }
}
