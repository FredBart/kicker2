using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.SpaServices.Webpack;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using KickerControllers;
using Microsoft.AspNetCore.Http;

namespace Kicker
{
    public class Startup
    {
        static KickerController kicker = new KickerController();
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddMvc();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
                app.UseWebpackDevMiddleware(new WebpackDevMiddlewareOptions
                {
                    HotModuleReplacement = true,
                    ReactHotModuleReplacement = true
                });
            }
            else
            {
                app.UseExceptionHandler("/Home/Error");
            }

            app.UseStaticFiles();

            // app.UseMvc(routes =>
            // {
            //     routes.MapRoute(
            //         name: "CmsRoutes",
            //         url: "{*permalink}",
            //         defaults: new { controller = "CmsCorePage", action = "Index" },
            //         constraints: new { url =  DependencyResolver.Current.GetService<CmsCoreRouting>() }
            //     );

            //     routes.MapRoute(
            //         name: "default",
            //         template: "{controller=Home2}/{action=Index}/{id?}");

            //     routes.MapSpaFallbackRoute(
            //         name: "spa-fallback",
            //         defaults: new { controller = "Home", action = "Index" });
            // });

            app.Run(async context =>
            {
                var req = context.Request;
                var res = context.Response;
                try
                {
                    var path = req.Path.ToString();
                    if (path.StartsWith("/teams"))
                    {
                        await kicker.TeamsEndpoint(req, res);
                        // await context.Response.WriteAsync("Hello, World!");
                    }
                    else if (path.StartsWith("/players"))
                    {
                        await kicker.PlayersEndpoint(req, res);
                    }
                    else if (req.Path == "/test.js")
                    {
                        // Allow external Javascript files
                        res.StatusCode = 200;
                        byte[] body = System.IO.File.ReadAllBytes("test.js");
                        res.ContentType = "text/javascript; charset=utf-8";
                        res.ContentLength = body.LongLength;
                        await res.Body.WriteAsync(body, 0, body.Length);
                    }
                    else
                    {
                        res.StatusCode = 404;
                    }
                }
                catch (Exception ex)
                {
                    Console.WriteLine(ex);
                    res.StatusCode = 500;
                }
            });
        }
    }
}
