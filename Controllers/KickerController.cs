using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Concurrent;
using System.Net;
using System.Net.Http;
using KickerFramework;

namespace Kicker.Controllers
{
    // http://localhost:5000/api/Kicker/<action> to get the return values of the methods
    // Kicker comes from KickerController as an extension to Controller
    // Slashes to combine controllers, actions and further parameters

    [Route("api/[controller]")]
    public class KickerController : Controller
    {
        static ConcurrentDictionary<string, Team> TEAMS_DB = new ConcurrentDictionary<string, Team>();
        static ConcurrentDictionary<string, Player> PLAYERS_DB = new ConcurrentDictionary<string, Player>();

        [HttpPost("[action]/{id}")]

        // The following will be the basis.
        static HttpResponseMessage PostTeam(string name)
        {
            if (!TEAMS_DB.TryAdd(name, new Team(name)))
            {
                // return 409
                return new HttpResponseMessage(HttpStatusCode.Conflict);
            }
            else
            {
                // return 201
                return new HttpResponseMessage(HttpStatusCode.Created);
            }
        }









        // The below part of this class is only for testing purpose.
        private static string[] Summaries = new[]
        {
            "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
        };

        [HttpGet("[action]")]
        public IEnumerable<WeatherForecast> WeatherForecasts()
        {
            var rng = new Random();
            return Enumerable.Range(1, 5).Select(index => new WeatherForecast
            {
                DateFormatted = DateTime.Now.AddDays(index).ToString("d"),
                TemperatureC = rng.Next(-20, 55),
                Summary = Summaries[rng.Next(Summaries.Length)]
            });
        }

        // fetch('api/Kicker/WeatherForecasts/20', {method : 'POST'}) in typescript sets number to 20.
        [HttpPost("[action]/{number}")]
        public IEnumerable<WeatherForecast> WeatherForecasts(int number)
        {
            var rng = new Random();
            return Enumerable.Range(1, 5).Select(index => new WeatherForecast
            {
                DateFormatted = DateTime.Now.AddDays(index).ToString("d"),
                TemperatureC = number,
                Summary = Summaries[rng.Next(Summaries.Length)]
            });
        }

        // http://localhost:5000/api/Kicker/testString/text returns 'test text'
        [HttpGet("[action]/{id}")]
        public string testString(string id)
        {
            return "test " + id;
        }

        public class WeatherForecast
        {
            public string DateFormatted { get; set; }
            public int TemperatureC { get; set; }
            public string Summary { get; set; }

            public int TemperatureF
            {
                get
                {
                    return 32 + (int)(TemperatureC / 0.5556);
                }
            }
        }

        public int Match(Team t1, Team t2, int goalst1, int goalst2)
        {
            if (goalst1 == goalst2)
            {
                // No draws allowed
                return 1;
            }
            if (goalst1 > goalst2)
            {
                // Add the goals plus 5 for the loser and 10 for the winner
                t1.points += goalst1 + 10;
                t2.points += goalst2 + 5;
            }
            else
            {
                t1.points += goalst1 + 5;
                t2.points += goalst2 + 10;
            }
            // Successful match
            return 0;
        }

        // Same code as in RemovePlayer => Change one, change both!
        public int AddPlayer(Team t, Player p)
        {
            if (t.members.Contains(p.name))
            {
                // Don't add one player multiple times
                return 1;
            }
            // Successful addition
            t.members.Add(p.name);
            p.teams.Add(t.name);
            return 0;
        }

        // Same code as in AddPlayer => Change one, change both!
        public int RemovePlayer(Team t, Player p)
        {
            if (!t.members.Contains(p.name))
            {
                // Don't try to remove what doesn't exist
                return 1;
            }
            // Successful Removal
            t.members.Remove(p.name);
            p.teams.Remove(t.name);
            return 0;
        }

    }

}