import * as React from 'react';
import { Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Home } from './components/Home';
import { FetchData } from './components/FetchData';
import { Counter } from './components/Counter';
// See ClientApp/components/KickerManagement.tsx, KickerData is a class in KickerManagement.tsx 
import { KickerData } from './components/KickerManagement';

export const routes = <Layout>
    <Route exact path='/' component={Home} />
    <Route path='/counter' component={Counter} />
    <Route path='/fetchdata' component={FetchData} />
    {/* Link /controls refers to ClientApp/components/KickerManagement.tsx, KickerData is a class in KickerManagement.tsx */}
    <Route path='/controls' component={KickerData} />
</Layout>;
