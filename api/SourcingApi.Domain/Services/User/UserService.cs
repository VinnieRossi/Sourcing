using Microsoft.EntityFrameworkCore;
using SourcingApi.Data;
using SourcingApi.Domain.Dtos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace SourcingApi.Domain.Services.User
{
    public class UserService
    {
        private readonly SourcingDbContext _dbContext;

        public UserService(SourcingDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<List<UserDto>> GetUsers()
        {
            var users = await _dbContext.Users
                .Where(user => user.IsActive)
                .Select(user => new UserDto
                {
                    Id = user.Id,
                    IsActive = user.IsActive
                })
                .ToListAsync();

            return users;
        }

        public async Task<List<UserDto>> CreateUser(UserDto newUser)
        {
            var user = new Data.Entities.User()
            {
                IsActive = newUser.IsActive
            };

            _dbContext.Users.Add(user);

            await _dbContext.SaveChangesAsync();

            return await GetUsers();
        }
    }
}
