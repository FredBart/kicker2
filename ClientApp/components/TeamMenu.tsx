import * as React from 'react';
import { RouteComponentProps } from 'react-router';


interface AttributeHandler {
    displayBool: boolean;
    alertString: string;
    displayAlert: boolean;
    alertColour: any;
    teamName: any;
    playerName: any;
}


export class TeamManager extends React.Component<RouteComponentProps<{}>, AttributeHandler> {
    constructor() {
        super();
        this.state = {
            displayBool: false,
            alertString: "",
            displayAlert: false,
            alertColour: 0,
            teamName: "select team",
            playerName: "select player"
        };

        this.handleTeamNameChange = this.handleTeamNameChange.bind(this);
        this.handlePlayerNameChange = this.handlePlayerNameChange.bind(this);
        this.postTeam = this.postTeam.bind(this);
        this.postPlayer = this.postPlayer.bind(this);
        this.deleteTeam = this.deleteTeam.bind(this);
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
                     <input type="text" value={this.state.teamName} onChange={this.handleTeamNameChange} />
                </label>
                <input type="submit" value="Submit" />
            </form>

            <form onSubmit={this.postPlayer}>
                <label>
                    Add Player:{'\u00A0'}
                     <input type="text" value={this.state.playerName} onChange={this.handlePlayerNameChange} />
                </label>
                <input type="submit" value="Submit" />
            </form>

            <p>This is a simple test of a React component.</p>

            <button onClick={() => { this.postPlayer("test2") }}>PostPlayer "test2"</button>



            {/* For now, it is only possible to delete teams with the names of the following fruits. */}
            <form onSubmit={this.deleteTeam}>
                <label>
                    Delete Team:
                    <div style={{ overflow: 'auto', maxHeight: 400 }}>
                        <select value={this.state.teamName}
                            onChange={this.handleTeamNameChange}>
                            <option value="grapefruit">Grapefruit</option>
                            <option value="lime">Lime</option>
                            <option value="coconut">Coconut</option>
                            <option value="mango">Mango</option>
                        </select>
                    </div>
                </label>
                <input type="submit" value="Submit" />
            </form>


        </div>;
    }

    changeTheBool() {
        this.setState({
            displayBool: !this.state.displayBool
        });
    }

    handleTeamNameChange(event: any) {
        this.setState({ teamName: event.target.value });
    }

    handlePlayerNameChange(event: any) {
        this.setState({ playerName: event.target.value });
    }


    postTeam(event: any) {
        this.callAPI("PostTeam", "POST", this.state.teamName, 201, 409, "Team " + this.state.teamName + " was created.", "Team " + this.state.teamName + " already exists.")
        event.preventDefault();
    }

    deleteTeam(event: any) {
        { if (window.confirm("Are you sure you wish to delete team "+ this.state.teamName+"?")) this.callAPI("DeleteTeam", "DELETE", this.state.teamName, 204, 404, "Team " + this.state.teamName + " was deleted.", "Team " + this.state.teamName + " was not found.") }
        event.preventDefault();
    }

    postPlayer(event: any) {
        this.callAPI("PostPlayer", "POST", this.state.playerName, 201, 409, "Player " + this.state.playerName + " was created.", "Player " + this.state.playerName + " already exists.")
        event.preventDefault();
    }


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

    handleJson(json: any, expectedValue: number, failureValue: number, successMessage: string, failureMessage: string) {
        if (json.statusCode === expectedValue) {
            this.inPageAlert(successMessage, "success")
        } else if (json.statusCode === failureValue) {
            this.inPageAlert(failureMessage, "failure")
        } else {
            this.inPageAlert("Unknown error", "warning")
        }
        // console.log(json.statusCode)
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

