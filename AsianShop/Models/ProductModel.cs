using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.AspNetCore.Http;

namespace AsianShop.Models
{
    public class Product
    {
        [Key]
        public int Id { get; set; }
        public string Name { get; set; }
        public uint Amount { get; set; }
        public float Price { get; set; }

        public string Unit { get; set; }
        public string From { get; set; }
        public string About { get; set; }
        public DateTime AddedDate{get;set;}
        public string AddedDateString{get;set;}
        public string FilePath { get; set; }
        //File connected to path
        #if NETCOREAPP
        [NotMapped]
        public IFormFile File { get; set; }
        #endif
        public int TypeId { get; set; }
        #if NETCOREAPP
        [NotMapped]
        #endif
        public Type Type { get; set;}

        public Product()
        {
            this.AddedDateString = this.AddedDate.Date.ToShortDateString();
        }
        public Product(string name,float price, string filePath, uint amount, int id,Type type, string unit, string from, string about)
        {
            this.Name = name;
            this.Price = price;
            this.FilePath = filePath;
            this.Amount = amount;
            this.TypeId = id;
            this.Type = type;
            this.Unit = unit;
            this.From = from;
            this.About = about;
        }

        public void setNewQuantity(uint quantity)
        {    
            this.Amount = this.Amount-quantity;
        }
    }
}