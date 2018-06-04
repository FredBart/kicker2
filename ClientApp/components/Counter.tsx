import * as React from 'react';
import { RouteComponentProps } from 'react-router';


interface AttributeHandler {
    displayBool: boolean;
}



export class TeamManager extends React.Component<RouteComponentProps<{}>, AttributeHandler> {
    constructor() {
        super();
        this.state = { displayBool: false };
    }


    public render() {
        return <div>

            <div>
                The variable is <b>{this.state.displayBool ? 'true' : 'false'}</b>.
            </div>

            <p>This is a simple example of a React component.</p>

            <button onClick={() => { this.postTeam() }}>PostTeam "test"</button>

            <button onClick={() => { alert("test") }}>Alert</button>

            <button onClick={() => { if (window.confirm('Are you sure you wish to delete this item?')) alert("Potato") }}> Delete </button>

            <button onClick={() => { this.changeTheBool() }}>variable changer</button>


        </div>;
    }

    changeTheBool() {
        this.setState({
            displayBool : !this.state.displayBool
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
            });
    }



}

