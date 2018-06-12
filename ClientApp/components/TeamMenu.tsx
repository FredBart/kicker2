import * as React from 'react';
import { RouteComponentProps } from 'react-router';


interface AttributeHandler {
    displayBool: boolean;
    alertString: string;
    displayAlert: boolean;
    alertColour: any;
    teamPostName: string;
    playerPostName: string;
    playerSelectionName: string;
    teamSelectionName: string;
    playerList: string[];
    teamList: string[];
}


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
            teamList: []
        };

        this.handleTeamNameChange = this.handleTeamNameChange.bind(this);
        this.handlePlayerNameChange = this.handlePlayerNameChange.bind(this);
        this.handleTeamSelectionName = this.handleTeamSelectionName.bind(this);
        this.handlePlayerSelectionName = this.handlePlayerSelectionName.bind(this);
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
                </div> : <div> {'\u00A0'} </div>}

            <form onSubmit={this.postTeam}>
                <label>
                    Add Team:{'\u00A0'}{'\u00A0'}{'\u00A0'}
                    <input type="text" value={this.state.teamPostName} onChange={this.handleTeamNameChange} />
                </label>
                <input type="submit" value="Submit" />
            </form>

            <form onSubmit={this.postPlayer}>
                <label>
                    Add Player:{'\u00A0'}
                    <input type="text" value={this.state.playerPostName} onChange={this.handlePlayerNameChange} />
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
                            onChange={this.handleTeamSelectionName}>
                            <option>---</option>
                            {this.state.teamList.map(function (idx) {
                                return (<option value={idx}>{idx}</option>)
                            })}
                        </select>
                    </div>
                </label>
                {/* <input type="submit" value="Delete" />
            </form> */}

                <button onClick={() => { if(this.state.teamSelectionName != "---") this.deleteTeam(this.state.teamSelectionName) }}>
                    Delete Team
            </button>
            </div>




            <div>
                {/* <form onSubmit={this.deletePlayer}> */}
                <label>
                    Players:
                    <div style={{ overflow: 'auto', maxHeight: 1200 }}>
                        <select value={this.state.playerSelectionName}
                            onChange={this.handlePlayerSelectionName}>
                            <option>---</option>
                            {this.state.playerList.map(function (idx) {
                                return (<option value={idx}>{idx}</option>)
                            })}
                        </select>
                    </div>
                </label>
                {/* <input type="submit" value="Delete" />
            </form> */}


                <button onClick={() => { if(this.state.playerSelectionName != "---") this.deletePlayer(this.state.playerSelectionName) }}>
                    Delete Player
            </button>
                {/* <button onClick={() => { this.getPlayers() }}> GetPlayers </button> */}
            </div>





        </div>

    }


    // handlePlayer(event: any, method: string){
    //     switch(method){
    //         case "delete":
    //             this.deletePlayer(event)
    //             break;
    //         default:
    //          this.inPageAlert("No method specified", "warning")
    //     }
    // }

    handleTeamNameChange(event: any) {
        this.setState({ teamPostName: event.target.value });
    }

    handlePlayerNameChange(event: any) {
        this.setState({ playerPostName: event.target.value });
    }

    handlePlayerSelectionName(event: any) {
        this.setState({ playerSelectionName: event.target.value });
    }

    handleTeamSelectionName(event: any) {
        this.setState({ teamSelectionName: event.target.value });
    }

    updateLists() {
        this.callApiGET("GetPlayers", 200, "success", "failure")
        this.callApiGET("GetTeams", 200, "success", "failure")
    }

    postTeam(event: any) {
        this.callAPI(
            "PostTeam",
            "POST",
            this.state.teamPostName,
            201,
            409,
            "Team " + this.state.teamPostName + " was created.",
            "Team " + this.state.teamPostName + " already exists.")
        this.updateLists()
        event.preventDefault();
    }

    postPlayer(event: any) {
        this.callAPI(
            "PostPlayer",
            "POST",
            this.state.playerPostName,
            201,
            409,
            "Player " + this.state.playerPostName + " was created.",
            "Player " + this.state.playerPostName + " already exists.")
        this.updateLists()
        event.preventDefault();
    }

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
        this.updateLists()
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
        this.updateLists()
    }

    // getPlayers() {
    //     // this.callAPI("GetPlayers", "GET", "", 202, 0, "success", "failure")
    //     this.callApiGET("GetPlayers", 202, "success", "failure")
    // }

    // deleteTeam(teamName: string) {
    //     this.callAPI("DeleteTeam", "DELETE", teamName, 204, 404, "Team " + teamName + " was deleted.", "Team " + teamName + " was not found.")
    // }


    callAPI(func: string, method: string, arg: string, expectedValue: number, failureValue: number, successMessage: string, failureMessage: string) {
        return fetch("api/Kicker/" + func + "/" + arg, {
            method
        }).then(
            response => response.json()
        ).then(
            json => {
                this.handleJson(json, expectedValue, failureValue, successMessage, failureMessage)
            }
        )
            .catch(error => {
                console.error(error)
                alert(error)
                return 400
            });
    }

    callApiGET(func: string, expectedValue: number, successMessage: string, failureMessage: string) {
        return fetch("api/Kicker/" + func, {
            method: "GET"
        }).then(
            response => response.text()
        ).then(
            text => {
                // console.log(text)
                // this.setState({playerList: text.split(',')})
                // this.handleText(text, expectedValue, failureValue, successMessage, failureMessage)
                this.handleCSV(text, func)
                return text.split(',')
            }
        )
            .catch(error => {
                console.error(error)
                alert(error)
                return ["error"]
            });
    }

    handleCSV(csv: string, urlFragment: string) {
        switch (urlFragment) {
            case "GetPlayers":
                this.setState({ playerList: csv.split(',') })
                break;
            case "GetTeams":
                this.setState({ teamList: csv.split(',') })
                break;
            default:
                console.log("No list specification to modify")
        }
    }

    handleJson(json: any, expectedValue: number, failureValue: number, successMessage: string, failureMessage: string) {
        if (json.statusCode === expectedValue) {
            this.inPageAlert(successMessage, "success")
        } else if (json.statusCode === failureValue) {
            this.inPageAlert(failureMessage, "failure")
        } else {
            this.inPageAlert("Unknown error", "warning")
        }
        console.log(json.content)
    }


    inPageAlert(message: string, alertType: string) {
        this.setState({
            alertString: message,
            displayAlert: true
        })
        this.setAlertType(alertType)
        setTimeout(() => {
            this.setState({ displayAlert: false });
        }, 3000)
        // setTimeout(function () { this.setState({ displayAlert: false }); }.bind(this), 3000);
        // setTimeout(function () { this.setState({ displayAlert: false }); }.bind(this), 1500)
    }


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

//     callAPI(func: string, meth: string, arg: string) {
//         return fetch("api/Kicker/" + func + "/" + arg, {
//             method: meth
//         }).then(
//             response => response.json()
//         ).then(
//             json => {
//                 this.handleJKsonStatusCode(json)
//                 return parseInt(json.statusCode)
//                 // return (json.statusCode > 199 && json.statusCode < 300)
//             }
//         )
//             .catch(error => {
//                 console.error(error)
//                 alert(error)
//                 return 400
//             });
//     }



//     // This function is a placeholder until I know a better solution how to handle the status codes.
//     handleJKsonStatusCode(json: any) {
//         console.log(json.statusCode)
//         switch (json.statusCode) {
//             case 200:
//                 console.log("OK")
//                 break;
//             case 201:
//                 console.log("Created")
//                 break;
//             case 202:
//                 console.log("Accepted")
//                 break;
//             case 204:
//                 console.log("No content")
//                 break;
//             case 404:
//                 console.log("Not found")
//                 break;
//             case 409:
//                 console.log("Conflict")
//                 break;
//             default:
//                 console.log("Unknown status code")
//         }
//     }
// }

