using System.Collections.Generic;
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
        
        [HttpGet("orderLines")]
        public IActionResult GetAllOrderLines()
        {
            //Get all customer
            var orderLines = _db.OrderLines;
            //Check if the customer exists, return 404 if it doesn't
            if (orderLines == null)
                return NotFound();
            foreach (var o in orderLines)
            {
                o.Product = _db.Products.Find(o.ProductId);
            }

            return Ok(orderLines);
        }
        
        [HttpGet("frontImages")]
        public IActionResult GetAllFrontImages()
        {
            
            //Get all customers
            var images = _db.FrontImages;
                 
            //Check if the customers exists, return 404 if it doesn't
            if (images == null)
                return NotFound();
            
            return Ok(images);
        }

        /*******************************Post*******************************/
        
        [HttpPost("customers")]
        public IActionResult PostCustomer([FromForm] Customer customer)
        {
            if(customer.Id != 0){       
                return BadRequest();
            }

            if (ModelState.IsValid)
            {
                _db.Add(customer);
                _db.SaveChanges();

                return Ok(customer);
            }

            return BadRequest();
        }
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
        
        [HttpPost("orderLines")]
        public async Task<IActionResult> PostOrderLines([FromForm] OrderLine orderLine)
        {
            if(orderLine.Id != 0){       
                return BadRequest();
            }

            if (ModelState.IsValid)
            {
                orderLine.Product = _db.Products.Find(orderLine.ProductId);
                _db.Add(orderLine);
                _db.SaveChanges();

                return Ok(orderLine);
            }
            return BadRequest();
        }
        
        [HttpPost("orders")]
        public async Task<IActionResult> PostOrder([FromForm] Order order)
        {
            string customerFName = Request.Form["firstName"];
            string customerLName = Request.Form["lastName"];
            string customerEmail = Request.Form["email"];
            string customerPhoneNumber = Request.Form["phoneNumber"];
            string customerPAddress = Request.Form["postAddress"];
            string customerPPlace = Request.Form["postPlace"];
            string customerPNumber = Request.Form["postNumber"];
            //string orderLines = Request.Form["orderLineIds"];
            //var orderLineAsArray = orderLines.Split(",");

            if (order.Id != 0)
            {
                return BadRequest();
            }

            if (ModelState.IsValid)
            {
                if (order.CustomerId.Equals(0))
                {
                    Customer customer = new Customer(customerEmail,customerFName,customerLName,customerPhoneNumber, customerPAddress,customerPNumber, customerPPlace);
                    PostCustomer(customer);
                    order.Customer = customer;
                }

                if (order.OrderLinesIds != "")
                {                   
                    var orderLineList = new List<OrderLine>();
                    var orderLineAsArray = order.OrderLinesIds.Split(",");
                    foreach (var o in orderLineAsArray)
                    {
                        orderLineList.Add(_db.OrderLines.Find(int.Parse(o)));
                    }

                    order.OrderLines = orderLineList;
                }
                
                _db.Add(order);
                _db.SaveChanges();

                return Ok(order);
            }
            return BadRequest();
        }
        [HttpPost("frontImages")]
        public async Task<IActionResult> PostFrontImage([FromForm] FrontImage image)
        {
            if (image.Id != 0)
            {
                return BadRequest();
            }

            if (ModelState.IsValid)
            {
                if (image.File == null)
                {
                    return BadRequest();
                }

                if (await _pr.StoreImage(image, _db.Products.Count() + 1) == false)
                {
                    return BadRequest();
                }


                _db.Add(image);
                _db.SaveChanges();

                return Ok(image);
            }
            return BadRequest();
        }
        [HttpDelete("frontImages/{id}")]
        public async Task<IActionResult> DeleteFrontImage(int id)
        {
            //Search for the given roof
            var image = _db.FrontImages.Find(id);
                 
            //Check if the roof exists, return 404 if it doesn't
            if (image == null)
                return NotFound();
     
            //Delete the file from directory, return bad request if filepath is empty
            if (await _pr.DeleteFile(image.FilePath) == false)
            {
                return BadRequest();
            }
            
            //Remove roof from the database
            _db.Remove(image);
            _db.SaveChanges();
                 
            //return 200 Ok with the roof
            return Ok(image);
        }
    }
}