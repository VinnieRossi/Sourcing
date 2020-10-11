using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.FeatureManagement;
using SourcingApi.Data;
using SourcingApi.Domain.Services.User;
using SourcingApi.Hubs;

namespace SourcingApi
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddControllers();

            services.AddDbContext<SourcingDbContext>(
                options => options.UseSqlServer(
            Configuration.GetConnectionString("DefaultConnection"), sqlOptions => { }));

            services.AddAzureAppConfiguration();

            services.AddFeatureManagement();

            //services.AddSignalR();

            services.AddSignalR().AddAzureSignalR(Configuration.GetConnectionString("AzureSignalR"));

            services.AddScoped<UserService>();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();

                // SignalR requires three policies enabled:
                // The origins must be explicitly specified. Wildcards are not accepted
                // GET and POST HTTP methods must be allowed
                // Credentials must be allowed

                app.UseCors(o => o.WithOrigins("http://localhost:3000").AllowCredentials().AllowAnyMethod().AllowAnyHeader());

                //app.UseCors(o => o.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader());
            } else
            {
                app.UseHsts();
            }

            // Run migrations on app start
            using (var serviceScope = app.ApplicationServices
            .GetRequiredService<IServiceScopeFactory>()
            .CreateScope())
            {
                using (var context = serviceScope.ServiceProvider.GetService<SourcingDbContext>())
                {
                    context.Database.Migrate();
                }
            }

            app.UseAzureAppConfiguration();

            app.UseHttpsRedirection();

            app.UseRouting();

            app.UseFileServer();

            app.UseAuthorization();

            app.UseWebSockets();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
                endpoints.MapHub<ChatHub>("/chat");
            });
        }
    }
}
