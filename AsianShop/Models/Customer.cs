using System.Collections.Generic;

namespace AsianShop.Models
{
    public class Customer
    {
        public int Id {get;set;}
        //TODO should this be used as ID or generated from dotnet?
        public string Email { get; set; }
        //First Name(s) of Customer
        public string FirstName { get; set; }
        //Last Name(s) of Customer
        public string LastName { get; set; }
        //Phone Number of Customer
        public string PhoneNumber { get; set; }
        //Living Address of Customer, where they live
        //Not always same as where they want the garage
        public string PostAddress { get; set; }
        //Post Number of Customer, where they live
        public string PostNumber { get; set; }
        //Town of Customer, where they live
        public string PostPlace { get; set; }
        
        public List<Order> Orders { get; set; }

        
        public Customer(string email, string firstName, string lastName, string phoneNumber, string postAddress, string postNumber, string postPlace)
        {
            this.Email = email;
            this.FirstName = firstName;
            this.LastName = lastName;
            this.PhoneNumber = phoneNumber;
            this.PostAddress = postAddress;
            this.PostNumber = postNumber;
            this.PostPlace = postPlace;
        }
    }
    
}