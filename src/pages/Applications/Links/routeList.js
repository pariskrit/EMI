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

export const routeList = [
	{
		id: 1,
		component: ApplicationList,
		path: applicationListPath,
	},
	{
		id: 2,
		component: Application,
		path: applicationDetailsPath,
	},
	{
		id: 3,
		component: CustomCaptions,
		path: applicationDetailsPath + customCaptionsPath,
	},
	{
		id: 4,
		component: ModelStatuses,
		path: applicationDetailsPath + modelStatusesPath,
	},
	{
		id: 5,
		component: Positions,
		path: applicationDetailsPath + positionsPath,
	},
	{
		id: 6,
		component: Roles,
		path: applicationDetailsPath + rolesPath,
	},
	{
		id: 7,
		component: ModelTypes,
		path: applicationDetailsPath + modelTypesPath,
	},
	{
		id: 8,
		component: OperatingModes,
		path: applicationDetailsPath + operatingModesPath,
	},
	{
		id: 9,
		component: Pauses,
		path: applicationDetailsPath + pausesPath,
	},
	{
		id: 10,
		component: Stops,
		path: applicationDetailsPath + stopsPath,
	},
	{
		id: 11,
		component: SkippedTasks,
		path: applicationDetailsPath + skippedTasksPath,
	},
	{
		id: 12,
		component: MissingItems,
		path: applicationDetailsPath + missingItemsPath,
	},
	{
		id: 13,
		component: StatusChanges,
		path: applicationDetailsPath + StatusChangesPath,
	},
	{
		id: 14,
		component: Actions,
		path: applicationDetailsPath + actionsPath,
	},
	{
		id: 15,
		component: Systems,
		path: applicationDetailsPath + systemsPath,
	},
	{
		id: 16,
		component: DefectRiskRatings,
		path: applicationDetailsPath + defectRiskRatingsPath,
	},
	{
		id: 17,
		component: DefectStatuses,
		path: applicationDetailsPath + defectStatusesPath,
	},
	{
		id: 18,
		component: DefectTypes,
		path: applicationDetailsPath + defectTypesPath,
	},
	{
		id: 19,
		component: FeedbackClassifications,
		path: applicationDetailsPath + feedbackClassificationsPath,
	},
	{
		id: 20,
		component: FeedbackPriorities,
		path: applicationDetailsPath + feedbackPrioritiesPath,
	},
	{
		id: 21,
		component: FeedbackStatuses,
		path: applicationDetailsPath + feedbackStatusesPath,
	},
];
