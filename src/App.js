import ErrorDialog from "components/Elements/ErrorDialog";
import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import "./App.scss";
import MainApp from "./routes";
import Home from "./routes/Home/Home";
import Launch from "./routes/Launch/Launch";
import Login from "./routes/Login/Login";

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
