import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import ErrorDialog from "components/ErrorDialog";
import Home from "./routes/Home/Home";
import Launch from "./routes/Launch/Launch";
import Login from "./routes/Login/Login";
import "./App.scss";
import MainApp from "./routes";

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
