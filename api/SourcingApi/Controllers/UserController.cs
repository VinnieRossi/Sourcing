using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.FeatureManagement;
using Microsoft.FeatureManagement.Mvc;
using SourcingApi.AzureAppConfig;
using SourcingApi.Domain.Dtos;
using SourcingApi.Domain.Services.User;

namespace SourcingApi.Controllers
{
    [ApiController]
    [Route("api")]
    public class UserController : ControllerBase
    {
        private readonly UserService _userService;
        //private readonly AppConfigProvider _appConfigProvider;

        public UserController(UserService userService)
        {
            _userService = userService;
            //_appConfigProvider = appConfigProvider;
        }

        [Authorize]
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

        //[HttpGet("beta")]
        ////[FeatureGate(SourcingFeatureFlags.Beta)]
        //public async Task<string> Beta()
        //{
        //    return await _userService.Beta();
        //}

        //[HttpGet("banner")]
        //public async Task<FeatureFlagConfig> GetBannerInfo()
        //{
        //    return _appConfigProvider.GetBannerInfo();
        //}
    }
}
