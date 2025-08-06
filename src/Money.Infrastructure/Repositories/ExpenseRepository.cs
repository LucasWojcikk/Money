using Microsoft.EntityFrameworkCore;
using Money.Application.DTOs.Expenses;
using Money.Application.Interfaces;
using Money.Domain.Entities;
using Money.Infrastructure.Data;

namespace Money.Infrastructure.Repositories
{
    public class ExpenseRepository : IExpenseRepository
    {
        private readonly MoneyDbContext _context;

        public ExpenseRepository(MoneyDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Expense>> GetByUserAsync(Guid userId) =>
            await _context.Expenses
                .Where(e => e.UserId == userId)
                .ToListAsync();

        public async Task<Expense> CreateAsync(CreateExpenseDto dto, Guid userId)
        {
            var expense = new Expense
            {
                Id = Guid.NewGuid(),
                Description = dto.Description,
                Amount = dto.Amount,
                Date = dto.Date,
                Category = dto.Category,
                UserId = userId
            };
            _context.Expenses.Add(expense);
            await _context.SaveChangesAsync();
            return expense;
        }

        public async Task<Expense?> GetByIdAsync(Guid id, Guid userId) =>
            await _context.Expenses
                .FirstOrDefaultAsync(e => e.Id == id && e.UserId == userId);

        public async Task UpdateAsync(Guid id, UpdateExpenseDto dto, Guid userId)
        {
            var expense = await GetByIdAsync(id, userId)
                          ?? throw new KeyNotFoundException("Despesa não encontrada");
            if (dto.Description is not null) expense.Description = dto.Description;
            if (dto.Amount is not null) expense.Amount = dto.Amount.Value;
            if (dto.Date is not null) expense.Date = dto.Date.Value;
            if (dto.Category is not null) expense.Category = dto.Category;
            _context.Expenses.Update(expense);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(Guid id, Guid userId)
        {
            var expense = await GetByIdAsync(id, userId)
                          ?? throw new KeyNotFoundException("Despesa não encontrada");
            _context.Expenses.Remove(expense);
            await _context.SaveChangesAsync();
        }
    }
}
