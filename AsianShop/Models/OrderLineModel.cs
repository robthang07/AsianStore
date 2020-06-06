namespace AsianShop.Models
{
    public class OrderLine
    {
        public int Id { get; set; }
        public int ProductId { get; set; }
        public Product Product { get; set; }
        public int Amount { get; set; }
        public OrderLine() {}

        public OrderLine(Product product, int amount)
        {
            this.Product = product;
            this.Amount = amount;
        }

        
    }
}