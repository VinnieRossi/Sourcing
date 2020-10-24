using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;
using SourcingApi.Hubs.Clients;
using SourcingApi.Hubs.Models;

namespace SourcingApi.Hubs
{
    public class ChatHub : Hub<IChatClient>
    {
        private readonly IHubContext<ChatHub> _hubContext;

        public ChatHub(IHubContext<ChatHub> hubContext)
        {
            _hubContext = hubContext;
        }

        public async Task SendMessage(ChatMessage message)
        {
            await Clients.All.ReceiveMessage(message);
        }

        public async Task SendPlayerState(PlayerState state)
        {
            state.x++;
            state.y++;

            await Clients.All.UpdatePlayerState(state);
        }
    }
}
