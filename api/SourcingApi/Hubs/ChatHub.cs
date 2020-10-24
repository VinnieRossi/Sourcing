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

        public async Task MovePlayer(UserDto player)
        {
            player.X++;
            player.Y++;

            await Clients.All.PlayersUpdated(player);
        }

        public async Task PlayerJoin()
        {
            var users = await _userService.GetUsers();

            await Clients.All.NewPlayerJoined(users);
        }
    }
}
