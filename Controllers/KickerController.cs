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



        // csv is mainly a placeholder. I do not yet know how to properly return all the relevant information.
        [HttpGet("[action]")]
        public ContentResult GetTeams(string csv)
        {
            csv = String.Join(",", TEAMS_DB.Keys);
            return new ContentResult
            {
                Content = csv,
                ContentType = "text/csv",
                StatusCode = 200
            };
        }


        [HttpGet("[action]")]
        public ContentResult GetPlayers()
        {
            string csv = String.Join(",", PLAYERS_DB.Keys);
            return new ContentResult
            {
                Content = csv,
                ContentType = "text/csv",
                StatusCode = 200
            };
            // return new HttpResponseMessage(HttpStatusCode.Accepted);
        }



        [HttpGet("[action]/{name}")]
        public ContentResult GetPlayersOfTeam(string name, string csv)
        {
            if (TEAMS_DB.TryGetValue(name, out Team team))
            {
                csv = String.Join(",", team.members);
                return new ContentResult
                {
                    Content = csv,
                    ContentType = "text/csv",
                    StatusCode = 200
                };
            }
            else
            {
                return new ContentResult
                {
                    Content = "",
                    ContentType = "text/plain",
                    StatusCode = 409
                };
            }
        }

        public ContentResult GetTeamsOfPlayers(string name, string csv)
        {
            if (PLAYERS_DB.TryGetValue(name, out Player player))
            {
                csv = String.Join(",", player.teams);
                return new ContentResult
                {
                    Content = csv,
                    ContentType = "text/csv",
                    StatusCode = 200
                };
            }
            else
            {
                return new ContentResult
                {
                    Content = "",
                    ContentType = "text/plain",
                    StatusCode = 409
                };
            }
        }


        [HttpPost("[action]/{name}")]

        // The following will be the basis.
        public HttpResponseMessage PostTeam(string name)
        {
            if (!TEAMS_DB.TryAdd(name, new Team(name)))
            {
                // return 409;
                return new HttpResponseMessage(HttpStatusCode.Conflict);
            }
            else
            {
                // return 201;
                return new HttpResponseMessage(HttpStatusCode.Created);
            }
        }

        [HttpPost("[action]/{name}")]
        public HttpResponseMessage PostPlayer(string name)
        {
            if (!PLAYERS_DB.TryAdd(name, new Player(name)))
            {
                // return 409;
                return new HttpResponseMessage(HttpStatusCode.Conflict);
            }
            else
            {
                // return 201;
                return new HttpResponseMessage(HttpStatusCode.Created);
            }
        }



        [HttpDelete("[action]/{name}")]
        public HttpResponseMessage DeleteTeam(string name)
        {
            if (TEAMS_DB.TryRemove(name, out Team _))
            {
                // return 204;
                return new HttpResponseMessage(HttpStatusCode.NoContent);
            }
            else
            {
                //return = 404;
                return new HttpResponseMessage(HttpStatusCode.NotFound);
            }
        }

        public HttpResponseMessage DeletePlayer(string name)
        {
            if (PLAYERS_DB.TryRemove(name, out Player _))
            {
                // return 204;
                return new HttpResponseMessage(HttpStatusCode.NoContent);
            }
            else
            {
                //return = 404;
                return new HttpResponseMessage(HttpStatusCode.NotFound);
            }
        }


        // /yourPath?teamName=a&playerName=b
        [HttpPut("[action]/{teamName,playerName}")]
        public HttpResponseMessage AddPlayerToTeam(string teamName, string playerName)
        {
            if (PLAYERS_DB.TryGetValue(playerName, out Player player)
             && TEAMS_DB.TryGetValue(teamName, out Team team))
            {
                if (AddPlayer(team, player) == 0)
                {
                    // return 200;
                    return new HttpResponseMessage(HttpStatusCode.OK);
                }
                else
                {
                    // return 409;
                    return new HttpResponseMessage(HttpStatusCode.Conflict);
                }
            }
            else
            {
                //return = 404;
                return new HttpResponseMessage(HttpStatusCode.NotFound);
            }
        }

        [HttpDelete("[action]/{teamName,playerName}")]
        public HttpResponseMessage RemovePlayerFromTeam(string teamName, string playerName)
        {
            if (PLAYERS_DB.TryGetValue(playerName, out Player player)
             && TEAMS_DB.TryGetValue(teamName, out Team team))
            {
                if (RemovePlayer(team, player) == 0)
                {
                    // return 200;
                    return new HttpResponseMessage(HttpStatusCode.OK);
                }
                else
                {
                    // return 409;
                    return new HttpResponseMessage(HttpStatusCode.Conflict);
                }
            }
            else
            {
                //return = 404;
                return new HttpResponseMessage(HttpStatusCode.NotFound);
            }
        }


        static int Match(Team t1, Team t2, int goalst1, int goalst2)
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
        static int AddPlayer(Team t, Player p)
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
        static int RemovePlayer(Team t, Player p)
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