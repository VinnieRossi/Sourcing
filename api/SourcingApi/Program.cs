using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Azure.Identity;
using Microsoft.Azure.KeyVault;
using System.ComponentModel.Design;
using Microsoft.Extensions.Configuration.AzureKeyVault;
using Microsoft.Azure.Services.AppAuthentication;

namespace SourcingApi
{
    public class Program
    {
        public static void Main(string[] args)
        {
            CreateHostBuilder(args).Build().Run();
        }

        public static IHostBuilder CreateHostBuilder(string[] args) =>
            Host.CreateDefaultBuilder(args)
                .ConfigureAppConfiguration((context, config) =>
                {
                    var builtConfig = config.Build();

                    var azureServiceTokenProvider = new AzureServiceTokenProvider();
                    var keyVaultClient = new KeyVaultClient(
                        new KeyVaultClient.AuthenticationCallback(
                            azureServiceTokenProvider.KeyVaultTokenCallback));

                    config.AddAzureAppConfiguration(options => {
                        options.Connect(builtConfig["AppConfigUri"])
                               .UseFeatureFlags(featureFlagOptions => {
                                   featureFlagOptions.CacheExpirationInterval = TimeSpan.FromMinutes(5);
                               });
                    });

                    config.AddAzureKeyVault(
                        builtConfig["KeyVaultUri"],
                        keyVaultClient,
                        new DefaultKeyVaultSecretManager());
                })
                .ConfigureWebHostDefaults(webBuilder =>
                {
                    webBuilder.UseStartup<Startup>();
                });
    }
}
