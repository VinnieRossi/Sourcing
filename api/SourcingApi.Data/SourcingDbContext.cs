using Microsoft.EntityFrameworkCore;
using SourcingApi.Data.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace SourcingApi.Data
{
    public class SourcingDbContext : DbContext
    {
        public SourcingDbContext(DbContextOptions<SourcingDbContext> options) : base(options)
        {

        }

        public DbSet<User> Users { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
        }
    }
}
