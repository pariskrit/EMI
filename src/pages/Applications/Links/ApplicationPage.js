import React from "react";
import { Route } from "react-router-dom";
import Actions from "pages/Applications/Actions/Action";
import Application from "pages/Applications/Application/Application";
import ApplicationList from "pages/Applications/ApplicationList/ApplicationList";
import CustomCaptions from "pages/Applications/CustomCaptions/CustomCaptions";
import DefectRiskRatings from "pages/Applications/DefectRiskRatings/DefectRiskRatings";
import DefectStatuses from "pages/Applications/DefectStatuses/DefectStatuses";
import DefectTypes from "pages/Applications/DefectTypes/DefectTypes";
import FeedbackClassifications from "pages/Applications/FeedbackClassifications/FeedbackClassifications";
import FeedbackPriorities from "pages/Applications/FeedbackPriorities/FeedbackPriorities";
import FeedbackStatuses from "pages/Applications/FeedbackStatuses/FeedbackStatuses";
import MissingItems from "pages/Applications/MissingItems/MissingItems";
import ModelStatuses from "pages/Applications/ModelStatuses/ModelStatuses";
import ModelTypes from "pages/Applications/ModelTypes/ModelType";
import OperatingModes from "pages/Applications/OperatingModes/OperatingModes";
import Pauses from "pages/Applications/Pauses/Pauses";
import Positions from "pages/Applications/Positions/Positions";
import Roles from "pages/Applications/Roles/Roles";
import SkippedTasks from "pages/Applications/SkippedTasks/SkippedTasks";
import StatusChanges from "pages/Applications/StatusChanges/StatusChanges";
import Stops from "pages/Applications/Stops/Stops";
import Systems from "pages/Applications/Systems/System";
import {
	actionsPath,
	applicationDetailsPath,
	applicationListPath,
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
import Applications from "..";

export default function ApplicationPage() {
	return (
		<Applications>
			<Route path={`/app${applicationListPath}`} exact>
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

			<Route path={applicationDetailsPath + feedbackClassificationsPath} exact>
				<FeedbackClassifications />
			</Route>

			<Route path={applicationDetailsPath + feedbackPrioritiesPath} exact>
				<FeedbackPriorities />
			</Route>

			<Route path={applicationDetailsPath + feedbackStatusesPath} exact>
				<FeedbackStatuses />
			</Route>
		</Applications>
	);
}
