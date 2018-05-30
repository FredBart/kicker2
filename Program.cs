using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using KickerControllers;


// every namespace with the word kicker in it is still WIP.

namespace Kicker
{
    public class Program
    {
        static KickerController kicker = new KickerController();

        public static void Main(string[] args)
        {
            BuildWebHost(args).Run();
        }

        public static IWebHost BuildWebHost(string[] args) =>
            WebHost.CreateDefaultBuilder(args)
                .UseStartup<Startup>()
                .Build();


        // public static IWebHost BuildWebHost2(string[] args) =>
        //     WebHost
        //     .CreateDefaultBuilder(args)
        //     .Configure(app =>
        //     app.Run(async context =>
        //     {
        //         var req = context.Request;
        //         var res = context.Response;
        //         try
        //         {
        //             var path = req.Path.ToString();
        //             if (path.StartsWith("/teams"))
        //             {
        //                 await kicker.TeamsEndpoint(req, res);
        //             }
        //             else if (path.StartsWith("/players"))
        //             {
        //                 await kicker.PlayersEndpoint(req, res);
        //             }
        //             else
        //             {
        //                 res.StatusCode = 404;
        //             }
        //         }
        //         catch (Exception ex)
        //         {
        //             Console.WriteLine(ex);
        //             res.StatusCode = 500;
        //         }
        //     })
        // )
        // .UseStartup<Startup>()
        // .Build();


        // static void Main()
        // {
        //     new WebHostBuilder()
        //         .UseKestrel()
        //         .Configure(app =>
        //             app.Run(async context =>
        //             {
        //                 var req = context.Request;
        //                 var res = context.Response;
        //                 try
        //                 {
        //                     var path = req.Path.ToString();
        //                     if (path.StartsWith("/teams"))
        //                     {
        //                         await kicker.TeamsEndpoint(req, res);
        //                     }
        //                     else if (path.StartsWith("/players"))
        //                     {
        //                         await kicker.PlayersEndpoint(req, res);
        //                     }
        //                     else
        //                     {
        //                         res.StatusCode = 404;
        //                     }
        //                 }
        //                 catch (Exception ex)
        //                 {
        //                     Console.WriteLine(ex);
        //                     res.StatusCode = 500;
        //                 }
        //             })
        //         )
        //         .Build()
        //         .Run();
        // }



    }
}


