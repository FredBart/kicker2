using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Concurrent;
using System.Net;
using System.Net.Http;

namespace Kicker.Controllers
{
    // http://localhost:5000/api/Kicker/<action> to get the return values of the methods
    // Kicker comes from KickerController as an extension to Controller
    // Slashes to combine controllers, actions and further parameters

    [Route("api/[controller]")]
    public class KickerController : Controller
    {
        static ConcurrentDictionary<string, KickerFramework.Team> TEAMS_DB = new ConcurrentDictionary<string, KickerFramework.Team>();
        static ConcurrentDictionary<string, KickerFramework.Player> PLAYERS_DB = new ConcurrentDictionary<string, KickerFramework.Player>();

        [HttpPost("[action]/{id}")]

        // The following will be the basis.
        static HttpResponseMessage PostTeam(string name)
        {
            if (!TEAMS_DB.TryAdd(name, new KickerFramework.Team(name)))
            {
                // return 409
                return new HttpResponseMessage(HttpStatusCode.Conflict);
            } else
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
    }
    public class KickerFramework
    {
        public class Player
        {
            // Player names must be unique. It is possible that people in real life share the same name,
            // but inside the GUI it will only cause confusion. Hence, it doesn't seem reasonable to
            // enable identical names.
            public string name;

            // players can be in multiple teams. This list is necessary to be able to efficiently delete players.
            public List<string> teams;

            //Constructor
            public Player(string nm)
            {
                name = nm;
                teams = new List<string>();
            }
        }

        public class Team
        {
            // Team names must be unique
            public string name;

            // List of members
            public List<string> members;

            // Points
            public int points;

            // Constructor
            public Team(string nm)
            {
                name = nm;
                members = new List<string>();
                points = 0;
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




// The code below is from an earlier consideration. First, I wanted to store
// matches instead of points, such that there would be a match history.
// However, since this is only an example project, and since tie programming
// skills are more important than what type of software I would like, I decided
// to remove the option. Nevertheless, I will keep the part commented out,
// because it's likely I'll use this code myself someday.

// Store matches instead of points. The number is unlikely to become
// large. Hence, all data can be stored, and the points can be
// computed later.


/*
public class Match
{
    // two teams
    string t1, t2;

    // respective goals
    int goalst1, goalst2;

    // Matches do not have names and hence need id's.
    public Guid id;

    // Constructor
    // No need for edit functions. Just rewrite the parameters manually.
    public Match(string ta, string tb, int goalsta, int goalstb)
    {
        id = Guid.NewGuid();
        t1 = ta;
        t2 = tb;
        goalst1 = goalsta;
        goalst2 = goalstb;
    }

    public int Goals(string team)
    {
        return team == t1 ? goalst1 : goalst2;
    }

    // Function to return the winner
    public string Winner()
    {
        int difference = Math.Sign(goalst1 - goalst2);
        switch (difference)
        {
            case -1:
                return t2;
            case 1:
                return t1;
            case 0:
                return "draw";
            default:
                return "unevaluated";
        }
    }

    // Function to return whether a specific team has won, lost or had a draw
    public int ResultOf(string team)
    {
        // Figure out the goals of the opponent
        int opponentGoals =  Goals(team == t1 ? t1 : t2);
        // Return +/-1 or 0 depending on win/loss or draw
        return Math.Sign(Goals(team) - opponentGoals);
    }

}
*/
