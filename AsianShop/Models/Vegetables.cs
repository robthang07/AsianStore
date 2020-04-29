using System;

namespace AsianShop.Models
{
    public class Vegetables:Product
    {
        private DateTime deliveredDate;

        public Vegetables(DateTime deliveredDate)
        {
            this.deliveredDate = deliveredDate;
        }
    }
}