using System.Threading.Tasks;
using AsianShop.Data;
using Microsoft.AspNetCore.Mvc;
using AsianShop.Models;
using Microsoft.AspNetCore.Identity;



namespace AsianShop.Controllers
{
    public class CheckoutController : Controller
    {
        private readonly ApplicationDbContext _context;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly SignInManager<ApplicationUser> _signInManager;
        public CheckoutController(ApplicationDbContext context, UserManager<ApplicationUser> userManager, SignInManager<ApplicationUser> signInManager)
        {
            _context = context;
            _userManager = userManager;
            _signInManager = signInManager;
        }
        // GET
        public IActionResult Index()
        {
            if (_signInManager.IsSignedIn(User))
            {
                var user = _userManager.GetUserAsync(User).Result; 
                ApplicationUser applicationUser = user;   
                return View(applicationUser);               
            }
            return View();
        }
        public IActionResult Receipt()
        {
            return View();
        }
    }
}