using System.Threading.Tasks;
using AsianShop.Data;
using AsianShop.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using System.Linq;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc.Rendering;

namespace AsianShop.Controllers
{
    public class ProductsController : Controller
    {
        private readonly ApplicationDbContext _db;
        private readonly UserManager<ApplicationUser> _userManager;
        public ProductsController(ApplicationDbContext db, UserManager<ApplicationUser> userManager)
        {
            _userManager = userManager;
            _db = db;
        }
        // GET
        public async Task<ViewResult> Index(float minPrice,string sort,float maxPrice,string currentFilter, string searchString, int? pageNumber, List<int> checkedTypes)
        {
            var products = from p in _db.Products
            select p;
            List<SelectListItem> sortOptions = new List<SelectListItem>()
            {
                new SelectListItem(){ Text="Date: newest to oldest", Value="0"},
                new SelectListItem(){ Text="Date: oldest to newest", Value="1"},
                new SelectListItem(){ Text="Price: low to high", Value="2"},
                new SelectListItem(){ Text="Price: high to low", Value="3"},
                new SelectListItem(){ Text="Name: descending", Value="4"},
                new SelectListItem(){ Text="Name: ascending", Value="5"}
            };
            ViewBag.sortOptions = sortOptions;

            ViewBag.checkedTypes = checkedTypes;


            ViewData["CurrentFilter"] = searchString;
            ViewData["MinPriceFilter"] = minPrice;
            ViewData["MaxPriceFilter"] = maxPrice;
            
            if (searchString != null || minPrice != 0 || maxPrice != 0)
            {
                pageNumber = 1;
            }
            else
            {
                ViewData["MinPriceFilter"] = "";
                ViewData["MaxPriceFilter"] = "";
                searchString = currentFilter;
            }

            
            if (!string.IsNullOrEmpty(searchString))
            {
                products = products.Where(p => p.Name.ToLower().Contains(searchString));
            }
            if (maxPrice != 0 || minPrice != 0)
            {
                products = products.Where(p => p.Price <= maxPrice && p.Price >= minPrice);
            }
            if(checkedTypes.Count != 0){
                products = products.Where(p => checkedTypes.Contains(p.TypeId));    
            }

            switch(sort)
            {
                case "0":
                products = products.OrderByDescending(p => p.AddedDate);
                break;
                case "1":
                products = products.OrderBy(p => p.AddedDate);
                break;
                case "2":
                products = products.OrderBy(p => p.Price);
                break;
                case "3":
                products = products.OrderByDescending(p => p.Price);
                break;
                case "4":
                products = products.OrderByDescending(p => p.Name);
                break;
                case "5":
                products = products.OrderBy(p => p.Name);
                break;
                default:
                products = products.OrderByDescending(p => p.AddedDate);
                break;
            }

            ViewData["Types"] = _db.Types;             
            int pageSize = 3;
            return View(await PaginatedList<Product>.CreateAsync(products.AsNoTracking(), pageNumber??1,pageSize));
        }
        

        public async Task<IActionResult> Details(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var product = await _db.Products
                .FirstOrDefaultAsync(m => m.Id == id);
            if (product == null)
            {
                return NotFound();
            }

            product.Type = _db.Types.Find(product.TypeId);

            return View(product);
        }
    }
}