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
		id: 3,
		component: CustomCaptions,
		path: customCaptionsPath,
	},
	{
		id: 4,
		component: ModelStatuses,
		path: modelStatusesPath,
	},
	{
		id: 5,
		component: Positions,
		path: positionsPath,
	},
	{
		id: 6,
		component: Roles,
		path: rolesPath,
	},
	{
		id: 7,
		component: ModelTypes,
		path: modelTypesPath,
	},
	{
		id: 8,
		component: OperatingModes,
		path: operatingModesPath,
	},
	{
		id: 9,
		component: Pauses,
		path: pausesPath,
	},
	{
		id: 10,
		component: Stops,
		path: stopsPath,
	},
	{
		id: 11,
		component: SkippedTasks,
		path: skippedTasksPath,
	},
	{
		id: 12,
		component: MissingItems,
		path: missingItemsPath,
	},
	{
		id: 13,
		component: StatusChanges,
		path: StatusChangesPath,
	},
	{
		id: 14,
		component: Actions,
		path: actionsPath,
	},
	{
		id: 15,
		component: Systems,
		path: systemsPath,
	},
	{
		id: 16,
		component: DefectRiskRatings,
		path: defectRiskRatingsPath,
	},
	{
		id: 17,
		component: DefectStatuses,
		path: defectStatusesPath,
	},
	{
		id: 18,
		component: DefectTypes,
		path: defectTypesPath,
	},
	{
		id: 19,
		component: FeedbackClassifications,
		path: feedbackClassificationsPath,
	},
	{
		id: 20,
		component: FeedbackPriorities,
		path: feedbackPrioritiesPath,
	},
	{
		id: 21,
		component: FeedbackStatuses,
		path: feedbackStatusesPath,
	},
];
