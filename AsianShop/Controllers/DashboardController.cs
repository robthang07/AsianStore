using Microsoft.AspNetCore.Mvc;

namespace AsianShop.Controllers
{
    public class DashboardController : Controller
    {
        // GET
        public IActionResult Index()
        {
            return
            View();
        }
    }
}