using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SourcingApi.AzureAppConfig
{
    public interface IAppConfigProvider
    {
        public FeatureFlagConfig GetBannerInfo();
    }
}
