namespace Services.ViewModel
{
    public class CategoryGroupModel
    {
        public Guid? Id { get; set; }

        public string Name { get; set; }

        public string Description { get; set; }
    }

    public class CategoryModel
    {
        public Guid? Id { get; set; }

        public Guid CategoryGroupId { get; set; }

        public string Name { get; set; }

        public decimal Price { get; set; }

        public decimal Duration { get; set; }
    }

    public class ServiceModel
    {
        public Guid? Id { get; set; }

        public string Name { get; set; } = string.Empty;

        public string? CategoryName { get; set; }

        public decimal Duration { get; set; } = 0;

        public decimal Price { get; set; } = 0;

        public Guid CategoryId { get; set; }

        public string? Description { get; set; }
    }
}
