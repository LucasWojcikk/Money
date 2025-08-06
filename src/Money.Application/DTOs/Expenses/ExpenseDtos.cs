namespace Money.Application.DTOs.Expenses
{
    // DTO usado para criar uma nova despesa
    public class CreateExpenseDto
    {
        public string Description { get; set; } = default!;
        public decimal Amount     { get; set; }
        public DateTime Date      { get; set; }
        public string Category    { get; set; } = default!;
    }

    // DTO usado para atualizar campos de uma despesa existente
    public class UpdateExpenseDto
    {
        public string?   Description { get; set; }
        public decimal?  Amount      { get; set; }
        public DateTime? Date        { get; set; }
        public string?   Category    { get; set; }
    }
}
