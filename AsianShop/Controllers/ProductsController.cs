using System.Threading.Tasks;
using AsianShop.Data;
using AsianShop.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;

namespace AsianShop.Controllers
{
    public class ProductsController : Controller
    {
        private readonly ApplicationDbContext _context;
        private readonly UserManager<ApplicationUser> _userManager;

        public ProductsController(ApplicationDbContext context, UserManager<ApplicationUser> userManager)
        {
            _userManager = userManager;
            _context = context;
        }
        // GET
        public async Task<ViewResult> Index()
        {
            var products = _context.Products;
            
            foreach (var product in products)
            {
                product.Type = _context.Types.Find(product.TypeId);
            }
            return View(await products.ToListAsync());
        }
        
        public async Task<IActionResult> Details(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var product = await _context.Products
                .FirstOrDefaultAsync(m => m.Id == id);
            if (product == null)
            {
                return NotFound();
            }

            product.Type = _context.Types.Find(product.TypeId);

            return View(product);
        }
    }
}