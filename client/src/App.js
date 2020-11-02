import React, { Fragment, useContext } from "react";

import "./App.css";

import {
	BrowserRouter as Router,
	Route,
	Switch,
	Redirect,
} from "react-router-dom";

import { AuthContext } from "./context/auth-context";

import MainNavigation from "./components/navigation/mainNavingation";

import AuthPage from "./pages/auth/auth";
import BookingsPage from "./pages/bookings";
import EventsPage from "./pages/events";

const App = () => {
	const { token } = useContext(AuthContext);

	return (
		<Router>
			<Fragment>
				<MainNavigation />
				<main className='main-layout'>
					<Switch>
						{token && <Redirect from='/' to='/events' exact />}
						{token && <Redirect from='/auth' to='/events' exact />}

						{!token && <Route path='/auth' component={AuthPage} />}
						<Route exact path='/events' component={EventsPage} />
						{token && <Route path='/bookings' component={BookingsPage} />}
						{!token && <Redirect to='/auth' exact />}
					</Switch>
				</main>
			</Fragment>
		</Router>
	);
};

export default App;
