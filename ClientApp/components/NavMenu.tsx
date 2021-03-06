import * as React from 'react';
import { Link, NavLink } from 'react-router-dom';

export class NavMenu extends React.Component<{}, {}> {
    public render() {
        return <div className='main-nav'>
            <div className='navbar navbar-inverse'>
                <div className='navbar-header'>
                    <button type='button' className='navbar-toggle' data-toggle='collapse' data-target='.navbar-collapse'>
                        <span className='sr-only'>Toggle navigation</span>
                        <span className='icon-bar'></span>
                        <span className='icon-bar'></span>
                        {/* <span className='icon-bar'></span> */}
                        {/* <span className='icon-bar'></span> */}
                        {/* <span className='icon-bar'></span> */}
                    </button>
                    <Link className='navbar-brand' to={'/'}>Kicker</Link>
                </div>
                <div className='clearfix'></div>
                <div className='navbar-collapse collapse'>
                    <ul className='nav navbar-nav'>
                        <li>
                            <NavLink to={'/'} exact activeClassName='active'>
                                <span className='glyphicon glyphicon-home'></span> Matches
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to={'/teams'} activeClassName='active'>
                                <span className='glyphicon glyphicon-th-list'></span> Teams And Players
                            </NavLink>
                        </li>
                        {/* <li>
                            <NavLink to={'/fetchdata'} activeClassName='active'>
                                <span className='glyphicon glyphicon-th-list'></span> Fetch data
                            </NavLink>
                        </li> */}
                        {/* <li> */}
                            {/* /controls is specified in ClientApp/ and leads to ClientApp/components/KickerManagement.tsx */}
                            {/* <NavLink to={'/controls'} activeClassName='active'>
                                <span className='glyphicon glyphicon-th-list'></span> Team Controls
                            </NavLink> */}
                        {/* </li> */}
                        {/* <li>
                            /controls is specified in ClientApp/ and leads to ClientApp/components/KickerManagement.tsx
                            <NavLink to={'/controls/renderForecastsTable'} activeClassName='active' action='POST'>
                                <span className='glyphicon glyphicon-th-list'></span> Test 1
                            </NavLink>
                        </li> */}
                    </ul>
                </div>
            </div>
        </div>;
    }
}
