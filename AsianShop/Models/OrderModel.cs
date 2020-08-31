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
        //has to be string because of the formdata when API requsts are made
        public string TotalPrice { get; set; }
        public DateTime OrderTime { get; set; }
        public string OrderDate { get; set; }
        private bool Delivered { get; set; }
        public string LastPickUpDate { get; set; }
        #if NETCOREAPP
        [NotMapped]
        #endif
        public List<OrderLine> OrderLines { get; set; }

        public string OrderLinesIds { get; set; }

        public Order(){
            this.OrderTime = DateTime.Now.Date;
            this.OrderDate = DateTime.Now.Date.ToShortDateString();
            this.LastPickUpDate = OrderTime.AddDays(7).ToShortDateString();
        }
        public Order(Customer customer, int customerId, string discount, string price, bool delivered)
        {
            this.Customer = customer;
            this.CustomerId = customerId;
            this.OrderLines = new List<OrderLine>();
            this.Discount = discount;
            this.TotalPrice = price;
            this.OrderTime = DateTime.Now.Date;
            this.OrderDate = DateTime.Now.Date.ToShortDateString();
            this.Delivered = delivered;
            this.LastPickUpDate = OrderTime.AddDays(7).ToShortDateString();
        }
        
    }
}