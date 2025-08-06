using System;

namespace Money.Domain.Entities
{
    public class RecurringExpense
    {
        public Guid Id { get; set; }
        public string Description { get; set; } = default!;
        public decimal Amount { get; set; }
        public int DayOfMonth { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public Guid UserId { get; set; }
        public User User { get; set; } = default!;
    }
}
