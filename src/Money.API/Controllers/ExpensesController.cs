using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Money.Domain.Entities;
using Money.Infrastructure.Data;

namespace Money.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ExpensesController : ControllerBase
{
    private readonly MoneyDbContext _context;

    public ExpensesController(MoneyDbContext context)
    {
        _context = context;
    }

    // GET: /api/expenses
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Expense>>> GetAll()
    {
        var expenses = await _context.Expenses.ToListAsync();
        return Ok(expenses);
    }

    // POST: /api/expenses
    [HttpPost]
    public async Task<ActionResult<Expense>> Create([FromBody] Expense expense)
    {
        _context.Expenses.Add(expense);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetAll), new { id = expense.Id }, expense);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Expense>> GetExpenseById(Guid id)
    {
        var expense = await _context.Expenses.FindAsync(id);

        if (expense == null)
            return NotFound();

        return Ok(expense);
    }


}
