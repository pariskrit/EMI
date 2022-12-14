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
import ProtectedRoute from "components/HOC/ProtectedRoute";
import ProtectedLogin from "components/HOC/ProtectedLogin";
import ForgotPassword from "pages/ForgotPassword/ForgotPassword";
import ResetPassword from "pages/ResetPassword/ResetPassword";
import RegisterUserEmail from "pages/RegisterUser/RegisterUser";
import Test from "pages/Test";
import { loginPath } from "helpers/routePaths";
import "./App.scss";

function App() {
	return (
		<div className="App">
			<ErrorDialog />
			<Router>
				<Switch>
					<Route path="/" exact>
						<Redirect to={loginPath} />
					</Route>
					<ProtectedLogin path={loginPath} exact component={Login} />
					<Route path="/forgot-password" exact>
						<ForgotPassword />
					</Route>
					<Route path="/ResetPassword" exact>
						<ResetPassword />
					</Route>

					<Route path="/Register" exact>
						<RegisterUserEmail />
					</Route>

					<Route path="/launch" exact>
						<Launch />
					</Route>
					<ProtectedRoute path="/app" component={MainApp} />
					<Route path="/test" component={Test} />
				</Switch>
			</Router>
		</div>
	);
}

export default App;
