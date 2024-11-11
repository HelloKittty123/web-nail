using DLL.Entities;
using Microsoft.EntityFrameworkCore;

namespace DLL
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options)
        {

        }

        /// <summary>
        /// Người dùng hệ thống
        /// </summary>
        public DbSet<User> Users { get; set; }

        /// <summary>
        /// Lịch làm việc
        /// </summary>
        public DbSet<Calendar> Calendars { get; set; }

        public DbSet<Category> Categories { get; set; }

        public DbSet<CategoryGroup> CategoryGroups { get; set; }

        public DbSet<CategoryCalendar> CategoryCalendars { get; set; }

        public DbSet<Customer> Customers { get; set; }

        public DbSet<Gallery> Galleries { get; set; }
    }
}
