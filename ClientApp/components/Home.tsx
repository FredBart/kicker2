import * as React from 'react';
import { RouteComponentProps } from 'react-router';

export class Home extends React.Component<RouteComponentProps<{}>, {}> {
    public render() {
        return <div>
            <h1>Hello, world!</h1>
            <p>
                This page is only a placeholder. Click on "Teams And Players" on the left to try all the functions.
            </p>
        </div>;
    }
}
