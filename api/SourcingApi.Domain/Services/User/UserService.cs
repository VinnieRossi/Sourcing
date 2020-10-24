using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.FeatureManagement;
using SourcingApi.Data;
using SourcingApi.Domain.Dtos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SourcingApi.Domain.Services.User
{
    public class UserService
    {
        private readonly SourcingDbContext _dbContext;
        //private readonly IFeatureManager _featureManager;

        public UserService(SourcingDbContext dbContext)
        {
            _dbContext = dbContext;
            //_featureManager = featureManager;
        }

        public async Task<List<UserDto>> GetUsers()
        {
            var users = await _dbContext.Users
                .AsQueryable() // Linq Async
                .Where(user => user.IsActive)
                .Select(user => new UserDto
                {
                    Id = user.Id,
                    Name = user.Name,
                    X = user.X,
                    Y = user.Y,
                    IsActive = user.IsActive
                })
                .ToListAsync();

            return users;
        }

        public async Task<List<UserDto>> CreateUser(UserDto newUser)
        {
            var user = new Data.Entities.User()
            {
                Id = newUser.Id,
                Name = newUser.Name,
                X = newUser.X,
                Y = newUser.Y,
                IsActive = newUser.IsActive,
            };

            _dbContext.Users.Add(user);

            await _dbContext.SaveChangesAsync();

            return await GetUsers();
        }

        //public async Task<string> Beta()
        //{
        //    // await featureManager.IsEnabledAsync(nameof(MyFeatureFlags.FeatureA))
        //    var test = _featureManager.GetFeatureNamesAsync(); //.ToListAsync();

        //    var asdf = await test.ToListAsync();

        //    if (await _featureManager.IsEnabledAsync("Beta"))
        //    {
        //        return "User is in Beta";
        //    }

        //    return "User is NOT in Beta";
        //}
    }
}
