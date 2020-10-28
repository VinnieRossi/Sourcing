using System;
using System.Collections.Generic;
using System.Text;

namespace SourcingApi.Domain.Dtos
{
    public class UserDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public int X { get; set; }
        public int Y { get; set; }
        public int TargetX { get; set; }
        public int TargetY { get; set; }
        public bool IsActive { get; set; }
    }
}
