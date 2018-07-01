import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { Team, AttributeHandler }  from "./BasicFunctions";





// export class TeamManager: React.Component<RouteComponentProps<{}> & AttributHandler {
export class TeamManager extends React.Component<RouteComponentProps<{}>, AttributeHandler> {
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
        // this.handleTeamNameChange = this.handleTeamNameChange.bind(this);
        // this.handlePlayerNameChange = this.handlePlayerNameChange.bind(this);
        // this.handleTeamSelectionName = this.handleTeamSelectionName.bind(this);
        // this.handlePlayerSelectionName = this.handlePlayerSelectionName.bind(this);
        this.postTeam = this.postTeam.bind(this);
        this.postPlayer = this.postPlayer.bind(this);
        // this.deleteTeam = this.deleteTeam.bind(this);
        // this.deletePlayer = this.deletePlayer.bind(this);
        // this.handlePlayer = this.handlePlayer.bind(this, null);
        this.updateLists()
    }


    public render() {

        return <div>

            {this.state.displayAlert
                ? <div style={{ backgroundColor: this.state.alertColour }}>
                    <p>{this.state.alertString}</p>
                </div> : <div> <p>{'\u00A0'}</p> </div>}

            <form onSubmit={this.postTeam}>
                <label>
                    Add Team:{'\u00A0'}{'\u00A0'}{'\u00A0'}
                    {/* <input type="text" value={this.state.teamPostName} onChange={this.handleTeamNameChange} /> */}
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

            {/* <button onClick={() => { this.getPlayers() }}> GetPlayers </button> */}


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



    // ------------------- PARAMETER UPDATERS -------------------


    // Functions to register the input in text boxes, dropdown menus etc.

    handleChange(property: keyof AttributeHandler) {
        return (event: any) => {
            this.setState({ [property]: event.target.value } as AttributeHandler);
        }
    }

    handleChangeNumber(property: keyof AttributeHandler) {
        return (event: any) => {
            this.setState({ [property]: event.target.value } as AttributeHandler);
        }
    }

    // handleTeamNameChange(event: any) {
    //     this.setState({ teamPostName: event.target.value });
    // }

    // handlePlayerNameChange(event: any) {
    //     this.setState({ playerPostName: event.target.value });
    // }

    // handlePlayerSelectionName(event: any) {
    //     this.setState({ playerSelectionName: event.target.value });
    // }

    // handleTeamSelectionName(event: any) {
    //     this.setState({ teamSelectionName: event.target.value });
    // }

    // Function to update the visible content of player and team lists
    updateLists() {
        this.callApiGET("GetPlayers")
        this.callApiGET("GetTeams")
        this.callApiGET("GetLadder")             // This won't be necessary for this page, later
    }

    updateLadder() {
        this.callApiGET("GetLadder")
    }


    // ------------------- API CALLS -------------------

    // Most basic API call, not suited for GET method
    callAPI(func: string, method: string, arg: string, expectedValue: number, failureValue: number, successMessage: string, failureMessage: string) {
        return fetch("api/Kicker/" + func + "/" + arg, {
            method
        }).then(
            response => response.json()
        ).then(
            json => {
                this.handleJson(json, expectedValue, failureValue, successMessage, failureMessage)
                this.updateLists()
            }
        )
            .catch(error => {
                console.error(error)
                alert(error)
                return 400
            });
    }

    // API call with multiple ?something=anythign statements connected via &'s
    callAPIMultiArgs(func: string, method: string, expectedValue: number, failureValues: number[], successMessage: string, failureMessages: string[], args: string[]) {
        let url = "api/Kicker/" + func
        args.forEach(element => {
            url += ("/" + element)
        });
        // url = url.substring(0, url.length - 1);
        console.log(url)
        return fetch(url, {
            method
        }).then(
            response => response.json()
        ).then(
            json => {
                // console.log(json)
                this.handleJsonMultiArgs(json, expectedValue, failureValues, successMessage, failureMessages)
            }
        )
            .catch(error => {
                console.error(error)
                alert(error)
                return 400
            });
    }

    // API call for GET method, expecting a different return type than the other calls
    callApiGET(func: string) {
        return fetch("api/Kicker/" + func, {
            method: "GET"
        }).then(
            response => {
                if (response.status != 200) {
                    alert("Failed to get data from server")
                }
                return response.text()
            }
        ).then(
            text =>
                this.handleCSV(text, func)
            // return text.split(',')

        )
            .catch(error => {
                console.error(error)
                alert(error)
                // return ["error"]
            });
    }


    // ------------------- BASIC FUNCTIONS -------------------

    // Decide what to do with a CSV. There are only few CSV's to handle, and they will always be the return parameters of GET calls.
    // So this function will execute the whole task for the return parameter.
    handleCSV(csv: string, urlFragment: string) {
        switch (urlFragment) {
            case "GetPlayers":
                this.setState({ playerList: csv.split(',') })
                break;
            case "GetTeams":
                this.setState({ teamList: csv.split(',') })
                break;
            case "GetLadder":
                // this.setState({ ladder: csv.split(',') })
                console.log(csv)
                this.setState({
                    ladder: this.convertLadder(csv.split(','))
                })
                break;
            default:
                console.log("No list specification to modify")
        }
    }

    // Convert a list of names and numbers into a list of Team classes containing respective names and numbers
    convertLadder(fullList: string[]) {
        var result: Team[];
        result = [];
        var len = fullList.length;
        for (var _i = 0; _i < len; _i += 2) {
            result.push(new Team(fullList[_i], Number(fullList[_i + 1])));
        }
        return result;
    }


    // Validate inputs for names of teams and players
    // Names must have 3-16 characters and is only allowed to have single spaces between the words.
    validate(name: string) {
        if (
            name.length > 16
            || name.length < 3
            || !name.match("^[a-zA-Z0-9_]+( [a-zA-Z0-9_]+)*$")
        ) return false
        else return true
    }

    // Check whether input is integer number
    isInteger(value: any) {
        if (Number(value) === parseInt(value, 10)) {
            return true
        }
        return false
    }


    // If the return value is Json, this code creates the correct alerts depending on the status code.
    handleJson(json: any, expectedValue: number, failureValue: number, successMessage: string, failureMessage: string) {
        if (json.statusCode === expectedValue) {
            this.inPageAlert(successMessage, "success")
        } else if (json.statusCode === failureValue) {
            this.inPageAlert(failureMessage, "failure")
        } else {
            this.inPageAlert("Unknown error", "warning")
        }
        // console.log(json.content)
    }

    // If the return value is Json, this code creates the correct alerts depending on the status code.
    handleJsonMultiArgs(json: any, expectedValue: number, failureValues: number[], successMessage: string, failureMessages: string[]) {
        let expectedResponse = false
        if (json.statusCode === expectedValue) {
            this.inPageAlert(successMessage, "success")
            expectedResponse = true
        } else
            for (let i = 0; i < failureValues.length; i++) {
                if (json.statusCode === failureValues[i]) {
                    this.inPageAlert(failureMessages[i], "failure")
                    expectedResponse = true
                }
            }
        if (!expectedResponse) {
            this.inPageAlert("Unknown error", "warning")
        }
        // console.log(json.content)
    }

    // Code to create alert messages within the page, to prevent too many popup windows from appearing
    inPageAlert(message: string, alertType: string) {
        this.setState({
            alertString: message,
            displayAlert: true,
            timestamp: Date.now()
        })
        this.setAlertType(alertType)
        setTimeout(() => {
            if (Date.now() - this.state.timestamp > 2900) this.setState({ displayAlert: false });
        }, 3000)
    }

    // There can only be one in-page alert. This code handles the type of alert.
    setAlertType(alertType: string) {
        switch (alertType) {
            case "success":
                this.setState({ alertColour: "#3c763d" })
                break;
            case "failure":
                this.setState({ alertColour: "#a94442" })
                break;
            case "warning":
                this.setState({ alertColour: "#8a6d3b" })
                break;
            default:
                this.setState({ alertColour: "#FFFFFF" })
        }
    }

}
