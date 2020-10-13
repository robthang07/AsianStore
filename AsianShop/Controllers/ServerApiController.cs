using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AsianShop.Data;
using AsianShop.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System.Text.Json.Serialization;
using MailKit.Net.Smtp;
using MimeKit;
using MimeKit.Text;

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
                var oIds = order.OrderLinesIds.Split(",");
                var orderLines = new List<OrderLine>();
                foreach(var i in oIds)
                {
                    int id = int.Parse(i);
                    var orderLine = getOrderLine(id);
                    orderLines.Add(orderLine);
                }
                order.OrderLines = orderLines;
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
            var orderLines = _db.OrderLines;

            if (orderLines == null)
                return NotFound();
            foreach (var o in orderLines)
            {
                o.Product = _db.Products.Find(o.ProductId);
            }

            return Ok(orderLines);
        }

        public OrderLine getOrderLine(int id)
        {
            var orderLine = _db.OrderLines.Find(id);
            orderLine.Product = _db.Products.Find(orderLine.ProductId);

            return orderLine;
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
            string stringPrice = Request.Form["newPrice"];
            decimal price =decimal.Parse(stringPrice, System.Globalization.CultureInfo.InvariantCulture);
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
                product.Price = price;
                _db.Add(product);
                _db.SaveChanges();

                return Ok(product);
            }
            return BadRequest();
        }

        [HttpPost("types")]
        public IActionResult PostTypes([FromForm] Type types)
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
        public IActionResult PostOrderLines([FromForm] OrderLine orderLine)
        {
            if(orderLine.Id != 0){       
                return BadRequest();
            }

            if (ModelState.IsValid)
            {
                //orderLine.Product = _db.Products.Find(orderLine.ProductId);
                _db.Add(orderLine);
                _db.SaveChanges();

                return Ok(orderLine);
            }
            return BadRequest();
        }
        
        [HttpPost("orders")]
        public IActionResult PostOrder([FromForm] Order order)
        {
            string customerFName = Request.Form["firstName"];
            string customerLName = Request.Form["lastName"];
            string customerEmail = Request.Form["email"];
            string customerPhoneNumber = Request.Form["phoneNumber"];
            string customerPAddress = Request.Form["postAddress"];
            string customerPPlace = Request.Form["postPlace"];
            string customerPNumber = Request.Form["postNumber"];
            string orderLines = Request.Form["orderLines"];
            //decimal totalPrice = decimal.Parse(Request.Form["test"]);
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
                if(orderLines != "")
                {
                    var oLines= JsonConvert.DeserializeObject<dynamic>(orderLines);
                    var oLineList = new List<OrderLine>();
                    var oLineIdList = new List<int>();
                    foreach(var i in oLines){
                        var productId = (int)i.productId;
                        var amount = (uint)i.amount;
                        var product = _db.Products.Find(productId);
                        OrderLine orderLine = new OrderLine(product,amount);
                        PostOrderLines(orderLine);
                        oLineList.Add(orderLine);
                        oLineIdList.Add(orderLine.Id);
                        product.setNewQuantity(amount);
                    }
                    order.OrderLinesIds = string.Join(",",oLineIdList);
                    order.OrderLines = oLineList;
                }
                SendEmail(order);

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
        /*******************************Delete*******************************/
        [HttpDelete("frontImages/{id}")]
        public async Task<IActionResult> DeleteFrontImage(int id)
        {
            //Search for the given image
            var image = _db.FrontImages.Find(id);
                 
            //Check if the image exists, return 404 if it doesn't
            if (image == null)
                return NotFound();
     
            //Delete the file from directory, return bad request if filepath is empty
            if (await _pr.DeleteFile(image.FilePath) == false)
            {
                return BadRequest();
            }
            
            //Remove image from the database
            _db.Remove(image);
            _db.SaveChanges();
                 
            //return 200 Ok with the image
            return Ok(image);
        }

        [HttpDelete("customers/{id}")]
        public IActionResult DeleteCustomer(int id)
        {
            var customer = _db.Customers.Find(id);
            if (customer == null)
            {
                return NotFound();
            }

            _db.Remove(customer);
            _db.SaveChanges();
            
            return Ok(customer);
        }
        
        [HttpDelete("products/{id}")]
        public async Task<ActionResult> DeleteProduct(int id)
        {
            var product = _db.Products.Find(id);
            if (product == null)
            {
                return NotFound();
            }
            
            //Delete the file from directory, return bad request if filepath is empty
            if (await _pr.DeleteFile(product.FilePath) == false)
            {
                return BadRequest();
            }

            _db.Remove(product);
            _db.SaveChanges();
            
            return Ok(product);
        }
        
        [HttpDelete("orders/{id}")]
        public ActionResult DeleteOrder(int id)
        {
            var order = _db.Orders.Find(id);
            if (order == null)
            {
                return NotFound();
            }
            DeleteOrderLines(order.OrderLinesIds);

            _db.Remove(order);
            _db.SaveChanges();
            
            return Ok(order);
        }

        public ActionResult DeleteOrderLines(string ids)
        {
            var idsList = ids.Split(",");
            OrderLine orderL;
            foreach(var i in idsList)
            {
                int id = int.Parse(i);
                orderL = _db.OrderLines.Find(id);
                if(orderL == null)
                {
                    return NotFound();
                }
                _db.Remove(orderL);
                _db.SaveChanges();   
            }

            return Ok();
        }
        
        /*******************************Edit*******************************/
        [HttpPut("types/{id}")]
        public IActionResult PutType(Type type)
        {
            if (!_db.Types.Any(p => p.id == type.id))
            {
                return NotFound();
            }

            _db.Update(type);
            _db.SaveChanges();
            
            return Ok(type);
        }

        [HttpPut("products/{id}")]
        public async Task<IActionResult> PutProduct([FromForm]Product product)
        {
            string stringPrice = Request.Form["newPrice"];
            decimal price =decimal.Parse(stringPrice, System.Globalization.CultureInfo.InvariantCulture);

            if (!_db.Products.Any(p => p.Id == product.Id))
            {
                return NotFound();
            }

            if(product.File != null)
            {
                if(await _pr.StoreProduct(product,product.Id) == false)
                {
                    return BadRequest();
                }
            }
            product.Type = _db.Types.Find(product.TypeId);
            product.Price = price;
            _db.Update(product);
            _db.SaveChanges();
            
            return Ok(product);
        }


        public IActionResult SendEmail(Order order)
        {
            var oIds = order.OrderLinesIds.Split(",");
            var html = "<table class="+"table table-striped>";
            var thead =  "<thead> <tr> <th>Item</th> <th>Price</th> <th>Quantity</th> </tr> </thead>";
            var tbody = "<tbody>";
            var tfoot ="<tfoot><tr><th></th><th>Totals:</th><td>"+order.TotalPrice+"kr"+"</td></tr></tfoot> </table>";       
            
            foreach(var i in oIds)
            {
                int id = int.Parse(i);
                var orderLine = getOrderLine(id);
                tbody += "<tr>"+"<td class="+"scope="+"col>"+orderLine.Product.Name+"</td>" +"<td>"+orderLine.Product.Price+"</td>" + "<td>"+orderLine.Amount+"</td>";
            }
            tbody +="</tr> </tbody>";
            html += thead+tbody+tfoot;
            
            
            var message = new MimeMessage();
            message.From.Add(new MailboxAddress("AsianShop","yourasianshop@gmail.com"));
            message.To.Add(new MailboxAddress(order.Customer.FirstName, order.Customer.Email));
            message.Subject = "Receipt";
            message.Body = new TextPart(TextFormat.Html) 
            { 
                Text = "<h1>Thank your for your purchase "+ order.Customer.FirstName+"!</h1>"+
                "<h3>The receipt</h3>"+ 
                "<p>Order id: "+order.Id+"</p>"+
                "<p>Name: "+order.Customer.FirstName + " "+ order.Customer.LastName + "</p>"+
                "<p>Email: "+order.Customer.Email+"</p>"+
                "<p>Phone number: "+order.Customer.PhoneNumber+"</p>"+
                "<p>Address: "+order.Customer.PostAddress+" "+ order.Customer.PostPlace+" "+ order.Customer.PostNumber +"</p><hr>"+
                html
            };

            using (var client = new SmtpClient())
            {
                client.Connect("smtp.gmail.com",587,false);
                client.Authenticate("yourasianshop@gmail.com","duerfaenstygg1");
                client.Send(message);
                client.Disconnect(true);
            }

            return Ok();
        }
    }
}