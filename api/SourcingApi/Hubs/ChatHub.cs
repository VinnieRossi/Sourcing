using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;
using SourcingApi.Domain.Dtos;
using SourcingApi.Domain.Services.User;
using SourcingApi.Hubs.Clients;
using SourcingApi.Hubs.Models;

namespace SourcingApi.Hubs
{
    public class ChatHub : Hub<IChatClient>
    {
        private readonly IHubContext<ChatHub> _hubContext;
        private readonly UserService _userService;

        public ChatHub(IHubContext<ChatHub> hubContext, UserService userService)
        {
            _hubContext = hubContext;
            _userService = userService;
        }

        public async Task SendMessage(ChatMessage message)
        {
            await Clients.All.ReceiveMessage(message);
        }

        public async Task MovePlayerUp(UserDto player)
        {
            //player.X++;
            //player.Y = Math.Max(0, player.Y - 2);

            await Clients.All.PlayersUpdated(player);
        }

        public async Task MovePlayerDown(UserDto player)
        {
            //player.X++;
            //player.Y = Math.Min(800, player.Y + 2);

            await Clients.All.PlayersUpdated(player);
        }

        public async Task MovePlayerLeft(UserDto player)
        {
            //player.X = Math.Max(0, player.X - 2);
            //player.Y++;

            await Clients.All.PlayersUpdated(player);
        }

        public async Task MovePlayerRight(UserDto player)
        {
            //player.X = Math.Min(800, player.X + 2);
            //player.Y++;

            await Clients.All.PlayersUpdated(player);
        }

        public async Task PlayerJoin()
        {
            var users = await _userService.GetUsers();

            await Clients.All.NewPlayerJoined(users);
        }
    }
}
