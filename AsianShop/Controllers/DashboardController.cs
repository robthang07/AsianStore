using System.Security.Principal;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AsianShop.Controllers
{
    public class DashboardController : Controller
    {
        [Authorize(Roles="Admin")]
        public IActionResult Index()
        {
                return View();
        }
    }
}