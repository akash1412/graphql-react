import React, { Fragment } from "react";

import "./App.css";

import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from "react-router-dom";

import MainNavigation from "./components/navigation/mainNavingation";

import AuthPage from "./pages/auth/auth";
import BookingsPage from "./pages/bookings";
import EventsPage from "./pages/events";

const App = () => {
  return (
    <Router>
      <Fragment>
        <MainNavigation />
        <main className='main-layout'>
          <Switch>
            <Redirect from='/' to='/auth' exact />
            <Route path='/auth' component={AuthPage} />
            <Route path='/events' component={BookingsPage} />
            <Route path='/bookings' component={EventsPage} />
          </Switch>
        </main>
      </Fragment>
    </Router>
  );
};

export default App;
