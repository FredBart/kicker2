using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Primitives;
using KickerFramework;
// using Microsoft.AspNetCore.Mvc;


namespace KickerControllers
{


    // [Route("api/[controller]")]
    // class KickerController : Controller
    class KickerController
    {
        static ConcurrentDictionary<string, Team> TEAMS_DB = new ConcurrentDictionary<string, Team>();
        static ConcurrentDictionary<string, Player> PLAYERS_DB = new ConcurrentDictionary<string, Player>();


        static string ID_REGEX = "[0-9a-zA-Z]+";

        // /teams
        public async Task TeamsEndpoint(HttpRequest req, HttpResponse res)
        {
            var segments = req.Path.ToString().Split("/");
            if (req.Path == "/teams")
            {
                if (req.Method == "GET")
                {
                    await GetTeams(req, res);
                }
                else
                {
                    res.StatusCode = 405;
                }
            }
            else if (new Regex($"^/teams/{ID_REGEX}$").IsMatch(req.Path))
            {
                var team = segments[segments.Length - 1];
                if (req.Method == "POST")
                {
                    PostTeam(team, req, res);
                }
                else if (req.Method == "DELETE")
                {
                    DeleteTeam(team, req, res);
                }
                else
                {
                    res.StatusCode = 405;
                }
            }
            else if (new Regex($"^/teams/{ID_REGEX}/players$").IsMatch(req.Path))
            {
                if (req.Method == "GET")
                {
                    var team = segments[segments.Length - 2];
                    await GetPlayersOfTeam(team, req, res);
                }
                else
                {
                    res.StatusCode = 405;
                }
            }
            else if (new Regex($"^/teams/{ID_REGEX}/players/{ID_REGEX}$").IsMatch(req.Path))
            {
                var team = segments[segments.Length - 3];
                var player = segments[segments.Length - 1];
                if (req.Method == "PUT")
                {
                    AddPlayerToTeam(team, player, req, res);
                }
                else if (req.Method == "DELETE")
                {
                    RemovePlayerFromTeam(team, player, req, res);
                }
                else
                {
                    res.StatusCode = 405;
                }
            }
            else
            {
                res.StatusCode = 404;
            }
        }

        // /players
        public async Task PlayersEndpoint(HttpRequest req, HttpResponse res)
        {
            var segments = req.Path.ToString().Split("/");
            if (req.Path == "/players")
            {
                if (req.Method == "GET")
                {
                    await GetPlayers(req, res);
                }
                else
                {
                    res.StatusCode = 405;
                }
            }
            else if (new Regex($"^/players/{ID_REGEX}$").IsMatch(req.Path))
            {
                var player = segments[segments.Length - 1];
                if (req.Method == "POST")
                {
                    PostPlayer(player, req, res);
                }
                else if (req.Method == "DELETE")
                {
                    DeletePlayer(player, req, res);
                }
                else
                {
                    res.StatusCode = 405;
                }
            }
            else if (new Regex($"^/players/{ID_REGEX}/teams$").IsMatch(req.Path))
            {
                if (req.Method == "GET")
                {
                    var player = segments[segments.Length - 2];
                    await GetTeamsOfPlayer(player, req, res);
                }
                else
                {
                    res.StatusCode = 405;
                }
            }
            else if (new Regex($"^/players/{ID_REGEX}/teams/{ID_REGEX}$").IsMatch(req.Path))
            {
                var player = segments[segments.Length - 3];
                var team = segments[segments.Length - 1];
                if (req.Method == "PUT")
                {
                    AddPlayerToTeam(team, player, req, res);
                }
                else if (req.Method == "DELETE")
                {
                    RemovePlayerFromTeam(team, player, req, res);
                }
                else
                {
                    res.StatusCode = 405;
                }
            }
            else
            {
                res.StatusCode = 404;
            }
        }

        // GET /teams
        // [HttpGet("[action]")]
        static Task GetTeams(HttpRequest req, HttpResponse res)
        {
            var csv = String.Join(",", TEAMS_DB.Keys);
            return WriteCsv(csv, res);
            // return new HttpResponseMessage(HttpStatusCode.Accepted);                
        }

         // GET /players
        static Task GetPlayers(HttpRequest req, HttpResponse res)
        {
            var csv = String.Join(",", PLAYERS_DB.Keys);
            return WriteCsv(csv, res);
            // return new HttpResponseMessage(HttpStatusCode.Accepted);                
        }


        // GET /teams/$teamId/players
        // [HttpGet("[action]/{name}")]
        static Task GetPlayersOfTeam(string name, HttpRequest req, HttpResponse res)
        {
            if (TEAMS_DB.TryGetValue(name, out Team team))
            {
                var csv = String.Join(",", team.members);
                return WriteCsv(csv, res);
                // return new HttpResponseMessage(HttpStatusCode.Accepted);                
            }
            else
            {
                return Task.CompletedTask;
                // return new HttpResponseMessage(HttpStatusCode.Conflict);
            }
        }


        // GET /players/$playerId/teams
        static Task GetTeamsOfPlayer(string name, HttpRequest req, HttpResponse res)
        {
            if (PLAYERS_DB.TryGetValue(name, out Player player))
            {
                var csv = String.Join(",", player.teams);
                return WriteCsv(csv, res);
                // return new HttpResponseMessage(HttpStatusCode.Accepted);                
            }
            else
            {
                return Task.CompletedTask;
                // return new HttpResponseMessage(HttpStatusCode.Conflict);
            }
        }


        // [HttpPost("[action]/{name}")]

        static void PostTeam(string name, HttpRequest req, HttpResponse res)
        {
            if (!TEAMS_DB.TryAdd(name, new Team(name)))
            {
                res.StatusCode = 409;
                // return new HttpResponseMessage(HttpStatusCode.Conflict);
            }
            else
            {
                res.StatusCode = 201;
                // return new HttpResponseMessage(HttpStatusCode.Created);
            }
        }

        // POST /players/$playerId
        static void PostPlayer(string name, HttpRequest req, HttpResponse res)
        {
            if (!PLAYERS_DB.TryAdd(name, new Player(name)))
            {
                res.StatusCode = 409;
                // return new HttpResponseMessage(HttpStatusCode.Conflict);
            }
            else
            {
                res.StatusCode = 201;
                // return new HttpResponseMessage(HttpStatusCode.Created);
            }
        }


        // DELETE /teams/$teamId
        // [HttpDelete("[action]/{name}")]
        static void DeleteTeam(string name, HttpRequest req, HttpResponse res)
        {
            if (TEAMS_DB.TryRemove(name, out Team _))
            {
                res.StatusCode = 204;
                // return new HttpResponseMessage(HttpStatusCode.Conflict);
            }
            else
            {
                res.StatusCode = 404;
                // return new HttpResponseMessage(HttpStatusCode.NotFound);
            }
        }

         // DELETE /players/$playerId
        static void DeletePlayer(string name, HttpRequest req, HttpResponse res)
        {
            if (PLAYERS_DB.TryRemove(name, out Player _))
            {
                res.StatusCode = 204;
                // return new HttpResponseMessage(HttpStatusCode.Conflict);
            }
            else
            {
                res.StatusCode = 404;
                // return new HttpResponseMessage(HttpStatusCode.NotFound);
            }
        }


        // PUT /players/$playerId/teams/$teamId
        // PUT /teams/$teamId/players/$playerId
        // [HttpPut("[action]/{teamName,playerName}")]
        static void AddPlayerToTeam(string teamName, string playerName, HttpRequest req, HttpResponse res)
        {
            if (PLAYERS_DB.TryGetValue(playerName, out Player player)
             && TEAMS_DB.TryGetValue(teamName, out Team team))
            {
                if (AddPlayer(team, player) == 0)
                {
                    res.StatusCode = 200;
                    // return new HttpResponseMessage(HttpStatusCode.OK);
                }
                else
                {
                    res.StatusCode = 409;
                    // return new HttpResponseMessage(HttpStatusCode.Conflict);
                }
            }
            else
            {
                res.StatusCode = 404;
                // return new HttpResponseMessage(HttpStatusCode.NotFound);
            }
        }

        // DELETE /players/$playerId/teams/$teamId
        // DELETE /teams/$teamId/players/$playerId
        // [HttpDelete("[action]/{teamName,playerName}")]
        static void RemovePlayerFromTeam(string teamName, string playerName, HttpRequest req, HttpResponse res)
        {
            if (PLAYERS_DB.TryGetValue(playerName, out Player player)
             && TEAMS_DB.TryGetValue(teamName, out Team team))
            {
                if (RemovePlayer(team, player) == 0)
                {
                    res.StatusCode = 200;
                    // return new HttpResponseMessage(HttpStatusCode.OK);
                }
                else
                {
                    res.StatusCode = 409;
                    // return new HttpResponseMessage(HttpStatusCode.Conflict);
                }
            }
            else
            {
                res.StatusCode = 404;
                // return new HttpResponseMessage(HttpStatusCode.NotFound);
            }
        }




        // Helper functions

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


        static Task WriteCsv(string csv, HttpResponse res)
        {
            var body = Encoding.UTF8.GetBytes(csv);
            res.StatusCode = 200;
            res.ContentType = "text/csv; charset=utf-8";
            res.ContentLength = body.LongLength;
            return res.Body.WriteAsync(body, 0, body.Length);
        }
    }
}