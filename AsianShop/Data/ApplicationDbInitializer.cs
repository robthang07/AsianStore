using System;
using System.Collections.Generic;
using AsianShop.Models;
using Microsoft.AspNetCore.Identity;
using Type = AsianShop.Models.Type;

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
            
            var hotFood = new Type("Hot food");
            db.Add(hotFood);
            var fruit = new Type("Fruits");
            db.Add(fruit);
            var vegetable = new Type("Vegetables");
            db.Add(vegetable);
            db.SaveChanges();
            
            var item = new Product("Salad", 22.22M, "testFilePath", 50, vegetable.id,vegetable,"kg","Spain","Exotic");
            db.Add(item);
            db.SaveChanges();
            var item2 = new Product("Apples", 12.99M, "TestFilePath2", 30, fruit.id,fruit,"kg","France","Exotic");
            db.Add(item2);
            db.SaveChanges();
            var item3 = new Product("Pizza", 12.99M, "TestFilePath2", 30, hotFood.id,hotFood,"piece","Italy","Exotic");
            db.Add(item3);
            db.SaveChanges();
            var item4 = new Product("Pear", 10.99M, "TestFilePath2", 30, fruit.id,fruit,"kg","Portugal","Exotic");
            db.Add(item4);
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