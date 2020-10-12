using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Threading.Tasks;

namespace SourcingApi.AzureAppConfig
{
    public class AppConfigProvider
    {
        private FeatureFlagConfig _config;

        public AppConfigProvider(IOptionsSnapshot<FeatureFlagConfig> config)
        {
            _config = config.Value;
        }

        public FeatureFlagConfig GetBannerInfo()
        {
            return _config;
        }
    }
}
