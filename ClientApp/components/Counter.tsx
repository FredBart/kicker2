import * as React from 'react';
import { RouteComponentProps } from 'react-router';


interface AttributeHandler {
    displayBool: boolean;
    alertString: string;
    displayAlert: boolean;
    alertColour: any;
}


var bgColors = {
    "Default": "#81b71a",
    "Blue": "#00B1E1",
    "Cyan": "#37BC9B",
    "Green": "#8CC152",
    "Red": "#E9573F",
    "Yellow": "#F6BB42",
};


export class TeamManager extends React.Component<RouteComponentProps<{}>, AttributeHandler> {
    constructor() {
        super();
        this.state = { displayBool: false, alertString: "", displayAlert: false, alertColour: 0 };
    }


    public render() {
        return <div>
            
            {this.state.displayAlert
                ? <div style={{ backgroundColor: this.state.alertColour }}>
                    <p>{this.state.alertString}</p>
                </div> : <div> </div>}


            <div>
                The variable is <b>{this.state.displayBool ? 'true' : 'false'}</b>.
            </div>

            <p>This is a simple example of a React component.</p>

            <button onClick={() => { this.postTeam() }}>PostTeam "test"</button>

            <button onClick={() => { alert("test") }}>Alert</button>

            <button onClick={() => { if (window.confirm('Are you sure you wish to delete this item?')) alert("Potato") }}> Delete </button>

            <button onClick={() => { this.changeTheBool() }}>variable changer</button>

            <button onClick={() => { this.postTeam2("test2") }}>PostTeam "test2"(new)</button>


        </div>;
    }

    changeTheBool() {
        this.setState({
            displayBool: !this.state.displayBool
        });
    }


    postTeam() {
        fetch("api/Kicker/PostTeam/test", {
            method: "POST"
        }).then(
            response => response.json()
        ).then(
            json => {
                if (json.statusCode == 201) {
                    console.log("Team created")
                } else {
                    console.log(json.statusCode += ": Team already exists")
                }
            }
        )
            .catch(error => {
                console.error(error)
                alert(error)
            });
    }


    // The current function does not cover other cases of failure. I will have to change this later.
    // I will have to change callAPI.
    // postTeam2(teamName: string) {
    //     let statusCode = this.callAPI("PostTeam", "POST", teamName)
    //     console.log(statusCode)
    //     switch (statusCode) {
    //         case 201:
    //             this.inPageAlert("Team created", "success")
    //             break;
    //         case 409:
    //             this.inPageAlert("Team already exists", "failure")
    //             break;
    //         default:
    //             this.inPageAlert("wtf", "warning")

    //     }
    // }


    postTeam2(teamName: string) {
        this.callAPI("PostTeam", "POST", teamName, 201, 409, "created", "exists")
    }


    callAPI(func: string, method: string, arg: string, successValue: number, failureValue: number, successMessage: string, failureMessage: string) {
        return fetch("api/Kicker/" + func + "/" + arg, {
            method
        }).then(
            response => response.json()
        ).then(
            json => {
                this.handleJson(json, successValue, failureValue, successMessage, failureMessage)
            }
        )
            .catch(error => {
                console.error(error)
                alert(error)
                return 400
            });
    }

    handleJson(json: any, successValue: number, failureValue: number, successMessage: string, failureMessage: string) {
        if (json.statusCode === successValue) {
            this.inPageAlert(successMessage, "success")
        } else if (json.statusCode === failureValue) {
            this.inPageAlert(failureMessage, "failure")
        } else {
            this.inPageAlert("Unknown error", "warning")
        }
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

