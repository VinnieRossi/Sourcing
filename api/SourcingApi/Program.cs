using System;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;
using Microsoft.Azure.KeyVault;
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

                    //config.AddAzureAppConfiguration(options => {

                    //    options.Connect(builtConfig["AppConfigUri"])
                    //        .ConfigureRefresh(refresh => {
                    //            refresh.Register("Banner:Sentinel", refreshAll: true)
                    //                .SetCacheExpiration(TimeSpan.FromSeconds(10));
                    //        })
                    //        //.UseFeatureFlags(featureFlagOptions => {
                    //        //    featureFlagOptions.CacheExpirationInterval = TimeSpan.FromMinutes(1);
                    //        //});
                    //});

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
