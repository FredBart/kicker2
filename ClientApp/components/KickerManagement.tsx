import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import 'isomorphic-fetch';

interface KickerState {
    forecasts: WeatherForecast[];
    loading: boolean;
}

export class KickerData extends React.Component<RouteComponentProps<{}>, KickerState> {
    constructor() {
        super();
        this.state = { forecasts: [], loading: true };

        // See KickerDataController in Controllers/KickerController.tsx
        fetch('api/Kicker/WeatherForecasts/20', { method: 'POST' })
            .then(test => test.json() as Promise<WeatherForecast[]>)
            .then(data => {
                this.setState({ forecasts: data, loading: false });
            });

        // fetch('teams/testTeam/players', { method: 'Post' })
        //     .then(response => response.text())
        //     .then(text => /* do something with text */)
        //     .then(data => {
        //         this.setState({ forecasts: data, loading: false });
        //     });
    }



    public render() {
        let contents = this.state.loading
            ? <p><em>Loading...</em></p>
            : KickerData.renderForecastsTable(this.state.forecasts);

        return <div>
            <h1>Weather forecast</h1>
            <p>This component demonstrates fetching data from the server.</p>

            {contents}
        </div>;
    }

    // public render() {
    //     return <div>
    //         <h1>Counter</h1>

    //         <p>This is a simple example of a React component.</p>

    //         <p>Current count: <strong>{ this.state.currentCount }</strong></p>

    //         <button onClick={ () => { this.incrementCounter() } }>Increment</button>
    //     </div>;
    // }

    private static renderPlayerTable() {
        return <ul>
            <li>

            </li>
        </ul>
    }


    private static renderForecastsTable(forecasts: WeatherForecast[]) {
        return <table className='table'>
            <thead>
                <tr>
                    <th>Date</th>
                    <th>Temp. (C)</th>
                    <th>Temp. (F)</th>
                    <th>Summary</th>
                </tr>
            </thead>
            <tbody>
                {forecasts.map(forecast =>
                    <tr key={forecast.dateFormatted}>
                        <td>{forecast.dateFormatted}</td>
                        <td>{forecast.temperatureC}</td>
                        <td>{forecast.temperatureF}</td>
                        <td>{forecast.summary}</td>
                    </tr>
                )}
            </tbody>
        </table>;
    }
}

interface WeatherForecast {
    dateFormatted: string;
    temperatureC: number;
    temperatureF: number;
    summary: string;
}
