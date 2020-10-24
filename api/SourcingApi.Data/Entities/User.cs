using System;
using System.Collections.Generic;
using System.Text;

namespace SourcingApi.Data.Entities
{
    public class User
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public int X { get; set; }
        public int Y { get; set; }
        public bool IsActive { get; set; }
    }
}
