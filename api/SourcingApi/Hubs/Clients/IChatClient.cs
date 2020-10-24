using SourcingApi.AzureAppConfig;
using SourcingApi.Domain.Dtos;
using SourcingApi.Hubs.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SourcingApi.Hubs.Clients
{
    public interface IChatClient
    {
        Task ReceiveMessage(ChatMessage message);
        Task PlayersUpdated(UserDto state);
        Task GetBannerInfo(FeatureFlagConfig config);
        Task NewPlayerJoined(List<UserDto> players);
    }
}
