import React from "react";
import ErrorDialog from "components/Elements/ErrorDialog";
import {
	BrowserRouter as Router,
	Route,
	Switch,
	Redirect,
} from "react-router-dom";
import MainApp from "pages";
import Launch from "pages/Launch/Launch";
import Login from "pages/Login/Login";
import "./App.scss";
import ProtectedRoute from "components/HOC/ProtectedRoute";
import ProtectedLogin from "components/HOC/ProtectedLogin";

function App() {
	return (
		<div className="App">
			<ErrorDialog />
			<Router>
				<Switch>
					{/* <Route path="/" exact>
						<Home />
					</Route> */}

					{/* <Route path="/login" exact>
						<Login />
					</Route> */}

					<Route path="/" exact>
						<Redirect to="/login" />
					</Route>

					<ProtectedLogin path="/login" exact component={Login} />

					<Route path="/launch" exact>
						<Launch />
					</Route>
					<ProtectedRoute path="/app" component={MainApp} />
				</Switch>
			</Router>
		</div>
	);
}

export default App;
