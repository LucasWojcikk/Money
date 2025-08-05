using Microsoft.EntityFrameworkCore;
using Money.Application.Interfaces;
using Money.Domain.Entities;
using Money.Infrastructure.Data;

namespace Money.Infrastructure.Repositories;

public class ExpenseRepository : IExpenseRepository
{
    private readonly MoneyDbContext _context;

    public ExpenseRepository(MoneyDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Expense>> GetAllAsync()
    {
        return await _context.Expenses.ToListAsync();
    }

    public async Task<Expense?> GetByIdAsync(Guid id)
    {
        return await _context.Expenses.FindAsync(id);
    }

    public async Task AddAsync(Expense expense)
    {
        _context.Expenses.Add(expense);
        await _context.SaveChangesAsync();
    }
}
