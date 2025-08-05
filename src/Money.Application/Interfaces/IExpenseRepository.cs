using Money.Domain.Entities;

namespace Money.Application.Interfaces
{
    public interface IExpenseRepository
    {
        Task<IEnumerable<Expense>> GetAllAsync();
        Task<Expense?> GetByIdAsync(Guid id);
        Task AddAsync(Expense expense);
    }
}
