using System.Threading.Tasks;
using AsianShop.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AsianShop.Controllers
{
    public class CheckoutController : Controller
    {
        private readonly ApplicationDbContext _context;

        public CheckoutController(ApplicationDbContext context)
        {
            _context = context;
        }
        // GET
        public async Task<IActionResult> Index()
        {
            var orderLines = _context.OrderLines;
            
            foreach (var o in orderLines)
            {
                o.Product = _context.Products.Find(o.ProductId);
                o.Product.Type = _context.Types.Find(o.Product.TypeId);
            }
            return View(await orderLines.ToListAsync());
        }
    }
}