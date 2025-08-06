using Microsoft.EntityFrameworkCore;
using Money.Domain.Entities;

namespace Money.Infrastructure.Data
{
    public class MoneyDbContext : DbContext
    {
        public MoneyDbContext(DbContextOptions<MoneyDbContext> options)
            : base(options)
        {
        }

        public DbSet<Expense> Expenses { get; set; } = default!;
        public DbSet<User> Users { get; set; } = default!;

        // ← Adicione esta linha:
        public DbSet<RecurringExpense> RecurringExpenses { get; set; } = default!;
    }
}
