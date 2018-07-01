import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { Team, AttributeHandler, TeamManagerProto } from "./BasicFunctions";


export class Home extends TeamManagerProto {
    constructor() {
        super();
        this.state = {
            displayBool: false,
            alertString: "",
            displayAlert: false,
            alertColour: 0,
            teamPostName: "",
            playerPostName: "",
            playerSelectionName: "---",
            teamSelectionName: "---",
            playerList: [],
            teamList: [],
            ladder: [],
            timestamp: 0,
            team1: "",
            team2: "",
            goals1: 0,
            goals2: 0
        };


        this.handleChange = this.handleChange.bind(this);
        this.updateLists()
    }


    public render() {

        return <div>

            {this.state.displayAlert
                ? <div style={{ backgroundColor: this.state.alertColour }}>
                    <p>{this.state.alertString}</p>
                </div> : <div> <p>{'\u00A0'}</p> </div>}




            {/* Ladder */}
            <h1> Ranking </h1>

            <div>
                <form>
                    <label>
                        Team 1:{'\u00A0'}{'\u00A0'}{'\u00A0'}
                        <input type="text" value={this.state.team1} onChange={this.handleChange("team1")} />
                    </label>
                </form>


                <form>
                    <label>
                        Team 2:{'\u00A0'}{'\u00A0'}{'\u00A0'}
                        <input type="text" value={this.state.team2} onChange={this.handleChange("team2")} />
                    </label>
                </form>


            </div>


            <div>
                <form>
                    <label>
                        Goals 1:{'\u00A0'}{'\u00A0'}
                        <input type="text" value={this.state.goals1} onChange={this.handleChange("goals1")} />
                    </label>
                </form>


                <form>
                    <label>
                        Goals 2:{'\u00A0'}{'\u00A0'}
                        <input type="text" value={this.state.goals2} onChange={this.handleChange("goals2")} />
                    </label>
                </form>


            </div>


            <button onClick={() => {
                if (this.isInteger(this.state.goals1) && this.isInteger(this.state.goals1))
                    if (this.state.team1 != this.state.team2) this.match(this.state.team1, this.state.team2, this.state.goals1, this.state.goals2)
                    else this.inPageAlert("Team 1 must be different from team 2.", "failure")
                else this.inPageAlert("Goals must be integer numbers.", "failure")
            }}>
                Make Match
                </button>

            <h2> Score </h2>

            <div style={{ overflow: 'auto' }}>
                <table id="myTable">
                    {this.state.ladder.map(function (idx) {
                        // return (<option value={idx.points + " " + idx.name}>{idx}</option>)
                        return <tr>
                            <td> {idx.name}</td>
                            <td> {'\u00A0'}{'\u00A0'} </td>
                            <td> {idx.points}</td>
                        </tr>

                    })}
                </table>
            </div>

        </div>

    }
       // Put functions

       match(team1: string, team2: string, goals1: number, goals2: number) {
        {
            if (window.confirm("Confirm: Team " + team1 + ": " + goals1 + " goals, team " + team2 + ": " + goals2 + " goals"))
                this.callAPIMultiArgs(
                    "Match",
                    "PUT",
                    200,
                    [409, 404],
                    "Team " + team1 + ": " + goals1 + " goals, team " + team2 + ": " + goals2 + " goals",
                    ["No draws allowed.", "One or both teams do not exist."],
                    [
                        team1,
                        team2,
                        goals1.toString(),
                        goals2.toString()
                    ])
        }
        this.updateLists()
    }
}