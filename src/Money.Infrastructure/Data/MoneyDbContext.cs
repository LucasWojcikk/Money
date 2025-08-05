using Microsoft.EntityFrameworkCore;
using Money.Domain.Entities;
using System.Collections.Generic;

namespace Money.Infrastructure.Data;

public class MoneyDbContext : DbContext
{
    public MoneyDbContext(DbContextOptions<MoneyDbContext> options)
        : base(options)
    {
    }

    public DbSet<Expense> Expenses { get; set; }
}