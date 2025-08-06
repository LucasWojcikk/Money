using Money.Application.DTOs.Expenses;
using Money.Domain.Entities;

namespace Money.Application.Interfaces
{
    public interface IExpenseRepository
    {
        // Já existentes:
        Task<IEnumerable<Expense>> GetByUserAsync(Guid userId);
        Task<Expense> CreateAsync(CreateExpenseDto dto, Guid userId);

        // Novos:
        Task<Expense?> GetByIdAsync(Guid id, Guid userId);
        Task UpdateAsync(Guid id, UpdateExpenseDto dto, Guid userId);
        Task DeleteAsync(Guid id, Guid userId);
    }
}
