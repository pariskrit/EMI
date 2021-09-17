import React from "react";
import ErrorDialog from "components/Elements/ErrorDialog";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import MainApp from "pages";
import Home from "pages/Home/Home";
import Launch from "pages/Launch/Launch";
import Login from "pages/Login/Login";
import "./App.scss";

function App() {
	return (
		<div className="App">
			<ErrorDialog />
			<Router>
				<Switch>
					<Route path="/" exact>
						<Home />
					</Route>

					<Route path="/login" exact>
						<Login />
					</Route>

					<Route path="/launch" exact>
						<Launch />
					</Route>

					<MainApp />
				</Switch>
			</Router>
		</div>
	);
}

export default App;
