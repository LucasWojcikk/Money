namespace Money.Application.DTOs.Expenses
{
    // DTO para criar uma despesa recorrente
    public class CreateRecurringExpenseDto
    {
        public string Description { get; set; } = default!;
        public decimal Amount { get; set; }
        public int DayOfMonth { get; set; }    // 1..31
        public DateTime StartDate { get; set; }    // data de início
        public DateTime? EndDate { get; set; }    // opcional: data de término
    }

    // DTO para atualizar uma despesa recorrente
    public class UpdateRecurringExpenseDto
    {
        public string? Description { get; set; }
        public decimal? Amount { get; set; }
        public int? DayOfMonth { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
    }
}
