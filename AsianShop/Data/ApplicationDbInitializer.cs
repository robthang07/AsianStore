using System;
using System.Collections.Generic;
using AsianShop.Models;
using Microsoft.AspNetCore.Identity;

namespace AsianShop.Data
{
    public class ApplicationDbInitializer
    {
        public static void Initialize(ApplicationDbContext db, UserManager<ApplicationUser> um, RoleManager<IdentityRole> rm)
        {          
            // Recreate DB during development
            db.Database.EnsureDeleted();
            db.Database.EnsureCreated();

            // Create roles
            var adminRole = new IdentityRole("Admin");
            rm.CreateAsync(adminRole).Wait();

            // Create users
            var admin = new ApplicationUser { UserName = "admin@uia.no", Email = "admin@uia.no" };
            um.CreateAsync(admin, "Password1.").Wait();
            um.AddToRoleAsync(admin, "Admin").Wait();

            var user = new ApplicationUser { UserName = "user@uia.no", Email = "user@uia.no" };
            um.CreateAsync(user, "Password1.").Wait();

            var item = new Product("Salat",225.222M,"testFilePath");
            db.Add(item);
            var item2 = new Product("Epler",12.99M,"TestFilePath2");
            db.Add(item);
            db.SaveChanges();
          
            var orderLine2 = new OrderLine(item2,55);
            var orderLine = new OrderLine(item,2);
            db.Add(orderLine);
            db.SaveChanges();
            
            var customer = new Customer("test@gmail.com","Jens","Petterson","444444444","testPost","4450","Oslo");
            db.Add(customer);
            db.SaveChanges();
            
            var order = new Order(customer,customer.Id,"Discount2",item.Price*orderLine.Amount,false);
            //order.OrderLines.Add(orderLine);
            //order.OrderLines.Add(orderLine2);
            db.Add(order);
            db.SaveChanges();
            
            // Finally save changes to the database
            db.SaveChanges();
        }

    }
}