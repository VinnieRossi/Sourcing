using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SourcingApi.AzureAppConfig
{
    public class FeatureFlagConfig
    {
        public bool ShowBanner { get; set; }

        public string BannerMessage { get; set; }
    }
}
