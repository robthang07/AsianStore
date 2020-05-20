using System.ComponentModel.DataAnnotations;

namespace AsianShop.Models
{
    public class Type
    {
        public int id { get; set; }
        [Required]
        public string Name { get; set; }

        public Type(){}
        public Type(string name)
        {
            this.Name = name;
        }
    }
}