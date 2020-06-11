using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.IO;
using Microsoft.AspNetCore.Http;

namespace AsianShop.Models
{
    public class FrontImage
    {
        #if NETCOREAPP
        [Key]
        #endif
        public int Id { get; set; }
        #if NETCOREAPP
        [NotMapped]
        public IFormFile File { get; set; }
        #endif
        public string Name { get; set; }
        public string FilePath { get; set; }
        public FrontImage(){}
    }
}