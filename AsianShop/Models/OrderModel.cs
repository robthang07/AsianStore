using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AsianShop.Models
{
    public class Order
    {
        #if NETCOREAPP
        [Key]
        #endif
        public int Id { get; set; }

        public Customer Customer { get; set; }
        public int CustomerId { get; set; }
        public string Discount { get; set; }
        public decimal TotalPrice { get; set; }
        public DateTime OrderDate { get; set; }
        private bool Delivered { get; set; }
        public DateTime LastPickUpDate { get; set; }
        #if NETCOREAPP
        [NotMapped]
        #endif
        public List<OrderLine> OrderLines { get; set; }

        public string OrderLinesIds { get; set; }

        public Order(){}
        public Order(Customer customer, int customerId, string discount, decimal price, bool delivered)
        {
            this.Customer = customer;
            this.CustomerId = customerId;
            this.OrderLines = new List<OrderLine>();
            this.Discount = discount;
            this.TotalPrice = price;
            this.OrderDate = DateTime.Now.Date;
            this.Delivered = delivered;
            this.LastPickUpDate = OrderDate.AddDays(7);
        }
        
    }
}