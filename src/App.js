import ErrorDialog from "components/ErrorDialog";
import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import ClientDetailScreen from "routes/Clients/ClientDetailScreen";
import SiteAsset from "routes/Clients/Sites/SiteAsset";
import SiteDetail from "routes/Clients/Sites/SiteDetail";
import SiteDepartmentsScreen from "routes/Clients/Sites/SiteDepartment/SiteDepartmentsScreen";
import SiteLocationsScreen from "routes/Clients/Sites/SiteLocations/SiteLocationsScreen";
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

					<Route path="/applicationlist" exact>
						<ApplicationList />
					</Route>

					<Route path="/application/:id" exact>
						<Application />
					</Route>

					<Route path="/application/:id/customcaptions" exact>
						<CustomCaptions />
					</Route>

					<Route path="/application/:id/modelstatuses" exact>
						<ModelStatuses />
					</Route>

					<Route path="/application/:id/positions" exact>
						<Positions />
					</Route>

					<Route path="/application/:id/roles" exact>
						<Roles />
					</Route>

					<Route path="/application/:id/modeltypes" exact>
						<ModelTypes />
					</Route>

					<Route path="/application/:id/operatingmodes" exact>
						<OperatingModes />
					</Route>

					<Route path="/application/:id/pauses" exact>
						<Pauses />
					</Route>

					<Route path="/application/:id/stops" exact>
						<Stops />
					</Route>

					<Route path="/application/:id/skippedtasks" exact>
						<SkippedTasks />
					</Route>

					<Route path="/application/:id/missingitems" exact>
						<MissingItems />
					</Route>

					<Route path="/application/:id/StatusChanges" exact>
						<StatusChanges />
					</Route>

					<Route path="/application/:id/actions" exact>
						<Actions />
					</Route>

					<Route path="/application/:id/systems" exact>
						<Systems />
					</Route>

					<Route path="/application/:id/defectriskratings" exact>
						<DefectRiskRatings />
					</Route>

					<Route path="/application/:id/defectstatuses" exact>
						<DefectStatuses />
					</Route>

					<Route path="/application/:id/defecttypes" exact>
						<DefectTypes />
					</Route>

					<Route path="/application/:id/feedbackclassifications" exact>
						<FeedbackClassifications />
					</Route>

					<Route path="/application/:id/feedbackpriorities" exact>
						<FeedbackPriorities />
					</Route>

					<Route path="/application/:id/feedbackstatuses" exact>
						<FeedbackStatuses />
					</Route>

					<Route path="/clientlist" exact>
						<ClientList />
					</Route>

					<Route path="/client/:id" exact>
						<ClientDetailScreen />
					</Route>

					<Route path="/client/:clientId/site/:id" exact>
						<SiteDetail />
					</Route>
					<Route path="/client/:clientId/site/:id/assets" exact>
						<SiteAsset />
					</Route>
					<Route path="/client/:clientId/site/:id/departments" exact>
						<SiteDepartmentsScreen />
					</Route>
					<Route path="/client/:clientId/site/:id/locations" exact>
						<SiteLocationsScreen />
					</Route>
				</Switch>
			</Router>
		</div>
	);
}

export default App;
