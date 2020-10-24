using SourcingApi.AzureAppConfig;
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
        Task UpdatePlayerState(PlayerState state);
        Task GetBannerInfo(FeatureFlagConfig config);
    }
}
