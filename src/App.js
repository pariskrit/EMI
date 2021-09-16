import ErrorDialog from "components/ErrorDialog";
import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { ApplicationPage } from "routes/Applications/Links/ApplicationPage";
import { ClientPage } from "routes/Clients/Links/ClientPage";
import SitePage from "routes/Clients/Sites/Links/SitePage";
import "./App.scss";

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

					<div>
						<ApplicationPage />
						<ClientPage />
						<SitePage />
					</div>
				</Switch>
			</Router>
		</div>
	);
}

export default App;
