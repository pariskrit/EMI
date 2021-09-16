import ErrorDialog from "components/ErrorDialog";
import {
	actionsPath,
	applicationDetailsPath,
	applicationListPath,
	clientDetailPath,
	clientsPath,
	customCaptionsPath,
	defectRiskRatingsPath,
	defectStatusesPath,
	defectTypesPath,
	feedbackClassificationsPath,
	feedbackPrioritiesPath,
	feedbackStatusesPath,
	missingItemsPath,
	modelStatusesPath,
	modelTypesPath,
	operatingModesPath,
	pausesPath,
	positionsPath,
	rolesPath,
	skippedTasksPath,
	StatusChangesPath,
	stopsPath,
	systemsPath,
} from "helpers/routePaths";
import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import ClientDetailScreen from "routes/Clients/ClientDetailScreen";
import SitePage from "routes/Clients/Sites/Links/SitePage";
import "./App.scss";
import Actions from "./routes/Applications/Actions/Action";
import Application from "./routes/Applications/Application/Application";
import ApplicationList from "./routes/Applications/ApplicationList/ApplicationList";
import CustomCaptions from "./routes/Applications/CustomCaptions/CustomCaptions";
import DefectRiskRatings from "./routes/Applications/DefectRiskRatings/DefectRiskRatings";
import DefectStatuses from "./routes/Applications/DefectStatuses/DefectStatuses";
import DefectTypes from "./routes/Applications/DefectTypes/DefectTypes";
import FeedbackClassifications from "./routes/Applications/FeedbackClassifications/FeedbackClassifications";
import FeedbackPriorities from "./routes/Applications/FeedbackPriorities/FeedbackPriorities";
import FeedbackStatuses from "./routes/Applications/FeedbackStatuses/FeedbackStatuses";
import MissingItems from "./routes/Applications/MissingItems/MissingItems";
import ModelStatuses from "./routes/Applications/ModelStatuses/ModelStatuses";
import ModelTypes from "./routes/Applications/ModelTypes/ModelType";
import OperatingModes from "./routes/Applications/OperatingModes/OperatingModes";
import Pauses from "./routes/Applications/Pauses/Pauses";
import Positions from "./routes/Applications/Positions/Positions";
import Roles from "./routes/Applications/Roles/Roles";
import SkippedTasks from "./routes/Applications/SkippedTasks/SkippedTasks";
import StatusChanges from "./routes/Applications/StatusChanges/StatusChanges";
import Stops from "./routes/Applications/Stops/Stops";
import Systems from "./routes/Applications/Systems/System";
import ClientList from "./routes/Clients/ClientList/ClientList";
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

					<Route path={applicationListPath} exact>
						<ApplicationList />
					</Route>

					<Route path={applicationDetailsPath} exact>
						<Application />
					</Route>

					<Route path={applicationDetailsPath + customCaptionsPath} exact>
						<CustomCaptions />
					</Route>

					<Route path={applicationDetailsPath + modelStatusesPath} exact>
						<ModelStatuses />
					</Route>

					<Route path={applicationDetailsPath + positionsPath} exact>
						<Positions />
					</Route>

					<Route path={applicationDetailsPath + rolesPath} exact>
						<Roles />
					</Route>

					<Route path={applicationDetailsPath + modelTypesPath} exact>
						<ModelTypes />
					</Route>

					<Route path={applicationDetailsPath + operatingModesPath} exact>
						<OperatingModes />
					</Route>

					<Route path={applicationDetailsPath + pausesPath} exact>
						<Pauses />
					</Route>

					<Route path={applicationDetailsPath + stopsPath} exact>
						<Stops />
					</Route>

					<Route path={applicationDetailsPath + skippedTasksPath} exact>
						<SkippedTasks />
					</Route>

					<Route path={applicationDetailsPath + missingItemsPath} exact>
						<MissingItems />
					</Route>

					<Route path={applicationDetailsPath + StatusChangesPath} exact>
						<StatusChanges />
					</Route>

					<Route path={applicationDetailsPath + actionsPath} exact>
						<Actions />
					</Route>

					<Route path={applicationDetailsPath + systemsPath} exact>
						<Systems />
					</Route>

					<Route path={applicationDetailsPath + defectRiskRatingsPath} exact>
						<DefectRiskRatings />
					</Route>

					<Route path={applicationDetailsPath + defectStatusesPath} exact>
						<DefectStatuses />
					</Route>

					<Route path={applicationDetailsPath + defectTypesPath} exact>
						<DefectTypes />
					</Route>

					<Route
						path={applicationDetailsPath + feedbackClassificationsPath}
						exact
					>
						<FeedbackClassifications />
					</Route>

					<Route path={applicationDetailsPath + feedbackPrioritiesPath} exact>
						<FeedbackPriorities />
					</Route>

					<Route path={applicationDetailsPath + feedbackStatusesPath} exact>
						<FeedbackStatuses />
					</Route>

					<Route path={clientsPath} exact>
						<ClientList />
					</Route>

					<Route path={clientDetailPath} exact>
						<ClientDetailScreen />
					</Route>

					<SitePage />
				</Switch>
			</Router>
		</div>
	);
}

export default App;
