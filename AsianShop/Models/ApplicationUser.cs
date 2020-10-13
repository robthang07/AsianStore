using Microsoft.AspNetCore.Identity;

namespace AsianShop.Models
{
    public class ApplicationUser:IdentityUser
    {
        //Email of Customer
        //TODO should this be used as ID or generated from dotnet?
        public override string Email { get; set; }
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
    }
}