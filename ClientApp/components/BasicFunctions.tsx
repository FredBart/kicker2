import * as React from 'react';
import { RouteComponentProps } from 'react-router';

export class Team {
    name: string;
    points: number;
    constructor(theName: string, thePoints: number) {
        this.name = theName;
        this.points = thePoints;
    }
}

export interface AttributeHandler {
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
    ladder: Team[];
    timestamp: number;
    team1: string;
    team2: string;
    goals1: number;
    goals2: number;
}
    
export class TeamManagerProto extends React.Component<RouteComponentProps<{}>, AttributeHandler> {

    

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
                this.updateLists()
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