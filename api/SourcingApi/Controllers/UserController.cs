using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using SourcingApi.Domain.Dtos;
using SourcingApi.Domain.Services.User;

namespace SourcingApi.Controllers
{
    [ApiController]
    [Route("api")]
    public class UserController : ControllerBase
    {
        private readonly UserService _userService;

        public UserController(UserService userService)
        {
            _userService = userService;
        }

        [HttpGet("users")]
        public async Task<List<UserDto>> GetUsers()
        {
            return await _userService.GetUsers();
        }

        [HttpPost("user")]
        public async Task<List<UserDto>> CreateUser(UserDto newUser)
        {
            return await _userService.CreateUser(newUser);
        }

        [HttpGet("test")]
        public async Task<string> Test()
        {
            return await _userService.Test();
        }
    }
}
