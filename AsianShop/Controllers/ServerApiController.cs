using AsianShop.Data;
using AsianShop.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace AsianShop.Controllers
{
    [ApiController]
    [Route("api/server")]
    public class ServerApiController : ControllerBase
    {

        //Database and user manager        
        private readonly ApplicationDbContext _db;
        private readonly UserManager<ApplicationUser> _userManager;

        public ServerApiController(ApplicationDbContext db, UserManager<ApplicationUser> userManager)
        {
            _db = db;
            _userManager = userManager;
        }
        
        /*******************************Get*******************************/
        [HttpGet("customers")]
        public IActionResult GetAllCustomers()
        {
            //Get all customer
            var customers = _db.Customers;
                 
            //Check if the customer exists, return 404 if it doesn't
            if (customers == null)
                return NotFound();
            
            return Ok(customers);
        }
        
        [HttpGet("products")]
        public IActionResult GetAllProducts()
        {
            //Get all customer
            var products = _db.Products;
                 
            //Check if the customer exists, return 404 if it doesn't
            if (products == null)
                return NotFound();
            
            return Ok(products);
        }
        
        [HttpGet("orders")]
        public IActionResult GetAllOrders()
        {
            //Get all customer
            var orders = _db.Orders;
                 
            //Check if the customer exists, return 404 if it doesn't
            if (orders == null)
                return NotFound();
            
            foreach (var order in orders)
            {
                order.Customer = _db.Customers.Find(order.CustomerId);
            }
            
            return Ok(orders);
        }
        
    }
}