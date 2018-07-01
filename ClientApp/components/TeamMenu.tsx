import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { Team, AttributeHandler, TeamManagerProto } from "./BasicFunctions";


export class TeamManager extends TeamManagerProto {
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
        this.postTeam = this.postTeam.bind(this);
        this.postPlayer = this.postPlayer.bind(this);
        this.resetInputs()
        this.updateLists()
    }


    public render() {

        return <div>

            {this.state.displayAlert
                ? <div style={{ backgroundColor: this.state.alertColour }}>
                    <p>{this.state.alertString}</p>
                </div> : <div> <p>{'\u00A0'}</p> </div>}

                
            {/* Management */}
            <h1> Team Management </h1>

            <form onSubmit={this.postTeam}>
                <label>
                    Add Team:{'\u00A0'}{'\u00A0'}{'\u00A0'}
                    <input type="text" value={this.state.teamPostName} onChange={this.handleChange("teamPostName")} />
                </label>
                <input type="submit" value="Submit" />
            </form>

            <form onSubmit={this.postPlayer}>
                <label>
                    Add Player:{'\u00A0'}
                    <input type="text" value={this.state.playerPostName} onChange={this.handleChange("playerPostName")} />
                </label>
                <input type="submit" value="Submit" />
            </form>



            <div>
                {/* <form onSubmit={this.deleteTeam}> */}
                <label>
                    Teams:
                    <div style={{ overflow: 'auto', maxHeight: 1200 }}>
                        <select value={this.state.teamSelectionName}
                            onChange={this.handleChange("teamSelectionName")}>
                            <option>---</option>
                            {this.state.teamList.map(function (idx) {
                                return (<option value={idx}>{idx}</option>)
                            })}
                        </select>
                    </div>
                </label>
                {/* <input type="submit" value="Delete" />
            </form> */}

                <button onClick={() => { if (this.state.teamSelectionName != "---") this.deleteTeam(this.state.teamSelectionName) }}>
                    Delete Team
            </button>
            </div>




            <div>
                {/* <form onSubmit={this.deletePlayer}> */}
                <label>
                    Players:
                    <div style={{ overflow: 'auto', maxHeight: 1200 }}>
                        <select value={this.state.playerSelectionName}
                            onChange={this.handleChange("playerSelectionName")}>
                            <option>---</option>
                            {this.state.playerList.map(function (idx) {
                                return (<option value={idx}>{idx}</option>)
                            })}
                        </select>
                    </div>
                </label>
                {/* <input type="submit" value="Delete" />
            </form> */}


                <button onClick={() => { if (this.state.playerSelectionName != "---") this.deletePlayer(this.state.playerSelectionName) }}>
                    Delete Player
                </button>
            </div>

            <br></br>


            <div>

                <button onClick={() => {
                    if (this.state.playerSelectionName != "---" && this.state.teamSelectionName != "---")
                        this.addPlayerToTeam(this.state.teamSelectionName, this.state.playerSelectionName)
                }}>
                    Add Player to Team
                </button>

                <button onClick={() => {
                    if (this.state.playerSelectionName != "---" && this.state.teamSelectionName != "---")
                        this.removePlayerFromTeam(this.state.teamSelectionName, this.state.playerSelectionName)
                }}>
                    Remove Player from Team
                </button>

                {/* <button onClick={() => {
                    this.callApiGET("GetLadder")
                }}>
                    Ranking to Console
                </button> */}


            </div>
        </div>

    }


    // ------------------- FUNCTIONS -------------------

    // Post functions

    postTeam(event: any) {
        if (this.validate(this.state.teamPostName)) {
            this.callAPI(
                "PostTeam",
                "POST",
                this.state.teamPostName,
                201,
                409,
                "Team " + this.state.teamPostName + " was created.",
                "Team " + this.state.teamPostName + " already exists.")
        } else {
            this.inPageAlert("Team name must consit out of 3-16 letters and/or numbers. Spaces are only allowed between the words.", "warning")
        }
        // this.updateLists()
        event.preventDefault();
    }

    postPlayer(event: any) {
        if (this.validate(this.state.playerPostName)) {
            this.callAPI(
                "PostPlayer",
                "POST",
                this.state.playerPostName,
                201,
                409,
                "Player " + this.state.playerPostName + " was created.",
                "Player " + this.state.playerPostName + " already exists.")
        } else {
            this.inPageAlert("Player name must consit out of 3-16 letters and/or numbers. Spaces are only allowed between the words.", "warning")
        }
        // this.updateLists()
        event.preventDefault();
    }

    // Delete functions

    deleteTeam(teamName: string) {
        {
            if (window.confirm("Are you sure you wish to delete team " + teamName + "?"))
                this.callAPI(
                    "DeleteTeam",
                    "DELETE",
                    teamName,
                    204,
                    404,
                    "Team " + teamName + " was deleted.",
                    "Team " + teamName + " was not found.")
        }
        // this.updateLists()
    }

    deletePlayer(playerName: string) {
        {
            if (window.confirm("Are you sure you wish to delete player " + playerName + "?"))
                this.callAPI(
                    "DeletePlayer",
                    "DELETE",
                    playerName,
                    204,
                    404,
                    "Player " + playerName + " was deleted.",
                    "Player " + playerName + " was not found.")
        }
        // this.updateLists()
    }

    // Add and remove from teams

    addPlayerToTeam(teamName: string, playerName: string) {
        this.callAPIMultiArgs(
            "AddPlayerToTeam",
            "PUT",
            200,
            [409],
            "Player " + playerName + " was added to team " + teamName + ".",
            ["Player " + playerName + " is already in team " + teamName + "."],
            [
                teamName,
                playerName
            ]
        )
        // this.updateLists()
    }


    removePlayerFromTeam(teamName: string, playerName: string) {
        this.callAPIMultiArgs(
            "RemovePlayerFromTeam",
            "DELETE",
            200,
            [409],
            "Player " + playerName + " was removed from team " + teamName + ".",
            ["Player " + playerName + " is not in team " + teamName + "."],
            [
                teamName,
                playerName
            ]
        )
        // this.updateLists()
    }






}
