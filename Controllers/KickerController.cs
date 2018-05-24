using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Concurrent;
using System.Text.RegularExpressions;


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
        static ConcurrentDictionary<Guid, Match> MATCHES_DB = new ConcurrentDictionary<Guid, Match>();
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
}


public class Player
{
    // Player names must be unique. It is possible that people in real life share the same name,
    // but inside the GUI it will only create confusion. Hence, it doesn't seem reasonable to
    // anable identical names.
    public string name;

    // players can be in multiple teams.
    public List<string> teams;

    // Store matches instead of points. The computation of the points is easy, it doesn't take much space,
    // and in the end it will be possible to check whether you would have won under a different rule set.
    // Also, it is possible to remove certain matches later on.
    public List<Guid> matches;

    //Constructor
    public Player(string nm)
    {
        name = nm;
        teams = new List<string>();
        matches = new List<Guid>();
    }

}

public class Team
{
    // Team names must be unique
    public string name;
    // List of members
    public List<string> members;

    // Store matches instead of points. The computation of the points is easy, it doesn't take much space,
    // and in the end it will be possible to check whether you would have won under a different rule set.
    // Also, it is possible to remove certain matches later on.
    public List<Guid> matches;
    // Constructor
    public Team(string nm)
    {
        name = nm;
        members = new List<string>();
        matches = new List<Guid>();
    }
}

// Store matches instead of points. The number is unlikely to become
// large. Hence, all data can be stored, and the points can be
// computed later.
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