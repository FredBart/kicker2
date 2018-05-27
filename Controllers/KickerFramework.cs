using System;
using System.Collections.Generic;

namespace KickerFramework
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
