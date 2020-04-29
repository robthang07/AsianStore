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
        public int Amount { get; set; }
        public decimal Price { get; set; }

        public string FilePath { get; set; }
        //File connected to path
        #if NETCOREAPP
        [NotMapped]
        public IFormFile file { get; set; }
        #endif    
        private Order order { get; set; }
        public Product(){}
        public Product(string name,decimal price, string filePath)
        {
            this.Name = name;
            this.Price = price;
            this.FilePath = filePath;
        }
    }
}