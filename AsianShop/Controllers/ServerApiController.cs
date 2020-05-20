using System.Linq;
using System.Threading.Tasks;
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
        private readonly ProductApiController _pr;

        public ServerApiController(ApplicationDbContext db, UserManager<ApplicationUser> userManager)
        {
            _db = db;
            _userManager = userManager;
            _pr = new ProductApiController(_db);
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

            foreach (var product in products)
            {
                product.Type = _db.Types.Find(product.TypeId);
            }

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

        [HttpGet("types")]
        public IActionResult GetAllTypes()
        {
            //Get all customer
            var types = _db.Types;

            //Check if the customer exists, return 404 if it doesn't
            if (types == null)
                return NotFound();

            return Ok(types);
        }

        /*******************************Post*******************************/
        [HttpPost("products")]
        public async Task<IActionResult> PostProduct([FromForm] Product product)
        {
            if (product.Id != 0)
            {
                return BadRequest();
            }

            if (ModelState.IsValid)
            {
                if (product.File == null)
                {
                    return BadRequest();
                }

                if (await _pr.StoreProduct(product, _db.Products.Count() + 1) == false)
                {
                    return BadRequest();
                }

                product.Type = _db.Types.Find(product.TypeId);

                _db.Add(product);
                _db.SaveChanges();

                return Ok(product);
            }
            return BadRequest();
        }

        [HttpPost("types")]
        public async Task<IActionResult> PostTypes([FromForm] Type types)
        {
            if(types.id != 0){       
                return BadRequest();
            }

            if (ModelState.IsValid)
            {
                _db.Add(types);
                _db.SaveChanges();

                return Ok(types);
            }

            return BadRequest();
        }
    }
}