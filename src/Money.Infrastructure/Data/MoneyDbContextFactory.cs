using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Money.Infrastructure.Data;

namespace Money.Infrastructure.Data;

public class MoneyDbContextFactory : IDesignTimeDbContextFactory<MoneyDbContext>
{
    public MoneyDbContext CreateDbContext(string[] args)
    {
        var optionsBuilder = new DbContextOptionsBuilder<MoneyDbContext>();

        // Connection string local
        optionsBuilder.UseNpgsql("Host=localhost;Port=5432;Database=moneydb;Username=postgres;Password=postgres");

        return new MoneyDbContext(optionsBuilder.Options);
    }
}
