using System;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using AsianShop.Data;
using AsianShop.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AsianShop.Controllers
{
    public class ProductApiController : ControllerBase
    {
        // File path definers: 
        private const string _mainPath = "wwwroot/resources";
        private const string _mainUrl = "/resources";
        private const string _dbFiles = "/DatabaseFiles";
        private const string _deletePath = "wwwroot";
        private const string _product = _dbFiles;
 

        //Filepath and fileUrls for the different types. 
        private const string ProductPath = _mainPath + _product;
        private const string ProductUrl = _mainUrl + _product;

        
        // The database variable. 
        private readonly ApplicationDbContext _db;

        /// <summary>
        /// Resource Api Controllers Constructor
        /// </summary>
        /// <param name="db">The database context you want it to use.</param>
        public ProductApiController(ApplicationDbContext db)
        {
            _db = db;
        }
        
        public async Task<bool> StoreProduct(Product product, int id)
        {
            if (_db.Products.Any(x => x.Id == id))
            {
                //Getting the filepath of the material, using AsNoTracking to avoid error
                var fPath = _deletePath + _db.Products.AsNoTracking().First(t => t.Id == id).FilePath;
                try
                {
                    System.IO.File.Delete(fPath);
                }
                catch(IOException io)
                {
                    //TODO Write better catch function
                    throw io;
                }
            }

            var typeName = _db.Types.AsNoTracking().First(t=>t.id == product.TypeId).Name;
            //Try to store the file. We receive the filepath back. 
            var filePath = await StoreFile(ProductUrl, ProductPath, product.File, id,typeName);

            //If the filepath is empty it could not add it. 
            if (filePath == "")
            {
                //Return false because it failed
                return false;
            }

            // Since we succeed, set the new filepath.  
            product.FilePath = filePath;
            
            // Empty file field for safety with sending back.
            product.File = null;

            // return true since it could add the file.  
            return true;
        }
        
        private async Task<string> StoreFile(string url,string path, IFormFile file, int id, string type)
        {
            //Variable to store the fileUrl in. 
            var fileUrl = "";
            var directoryPath = path + "/" + type;
            // Check that file is not empty
            if (file.Length > 0)
            {
                if (Directory.Exists(directoryPath))
                {
                    //The file extension. 
                    var fileExtension = file.FileName.Split(".")[1];
                
                    // The filepath we use to retrieve it. The one in database
                    fileUrl = url + "/" + type + "/" + id + "." + fileExtension;
                
                    // The actual filepath. 
                    var filePath = directoryPath + "/"+ id + "." + fileExtension;

                    //Copy the file with a file stream. 
                    using (var stream = System.IO.File.Create(filePath))
                    {
                        await file.CopyToAsync(stream);
                    }
                }
                else
                {
                    Directory.CreateDirectory(directoryPath);
                    var fileExtension = file.FileName.Split(".")[1];
                
                    // The filepath we use to retrieve it. The one in database
                    fileUrl = url + "/" + type + "/" + id + "." + fileExtension;
                
                    // The actual filepath. 
                    var filePath = directoryPath + "/"+ id + "." + fileExtension;

                    //Copy the file with a file stream. 
                    using (var stream = System.IO.File.Create(filePath))
                    {
                        await file.CopyToAsync(stream);
                    }
                }
               
            }
            //Return the fileUrl
            return fileUrl;
        }
        
        //Delete file from the directory after being edited or deleted
        public async Task<bool> DeleteFile(string filePath)
        {
            //Sets the filepath into lists
            String[] listOfPaths = filePath.Split(",");
            //If the filepath is empty, there is something wrong
            if (filePath == "")
            {
                return false;
            }
            
            //Loops trough the list and delete the paths
            foreach (var s in listOfPaths)
            {
                //The delete path + the file path
                var deletePath = _deletePath + s;
                try
                {
                    //Delete the file from the directory
                    System.IO.File.Delete(deletePath);
                
                }
                catch(IOException io)
                {
                    //TODO Write better catch function
                    throw io;
                }
            }
            //Return true if everything works as intended
            return true;
        }
    }    
}