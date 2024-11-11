namespace Services.ViewModel
{
    public class GalleryModel
    {
        public GalleryItem First { get; set; }

        public GalleryItem Second { get; set; }

        public GalleryItem Third { get; set; }

        public GalleryItem Fourth { get; set; }

        public GalleryItem Fifth { get; set; }

        public GalleryItem Sixth { get; set; }

        public GalleryItem Seventh { get; set; }

        public GalleryItem Panel { get; set; }

        public GalleryItem Eighth { get; set; }

    }

    public class GalleryItem
    {
        public string Name { get; set; }

        public string Url { get; set; }

        public string Title { get; set; }

        public string SubTitle { get; set; }
    }
}
