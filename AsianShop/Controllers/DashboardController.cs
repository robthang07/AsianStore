using System.Security.Principal;
using Microsoft.AspNetCore.Mvc;

namespace AsianShop.Controllers
{
    public class DashboardController : Controller
    {
        // GET
        public IActionResult Index()
        {
            if (User.IsInRole("Admin"))
            {
                return
                    View();
            }
            
            return new ForbidResult();

        }
        
    }
}