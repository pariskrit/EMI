import { BASE_API_PATH } from "helpers/constants";
//Missing Part or Tool Reasons
import {
	addMissingPartorToolReasons,
	getMissingPartorToolReasons,
	patchMissingPartorToolReasons,
} from "services/clients/sites/siteApplications/missingPartorToolReasons";
import {
	addModelTypes,
	getModelTypes,
	patchModelTypes,
} from "services/clients/sites/siteApplications/modelTypes";
//Skipped Tasks
import {
	addSkippedTasks,
	getSkippedTasks,
	patchSkippedTasks,
} from "services/clients/sites/siteApplications/skippedTasks";
//Status Changes
import {
	addStatusChanges,
	getStatusChanges,
	patchStatusChanges,
} from "services/clients/sites/siteApplications/statusChanges";
//Stop Reasons
import {
	addStopReasons,
	getStopReasons,
	patchStopReasons,
} from "services/clients/sites/siteApplications/stopReasons";
//Feedback Classifications
import {
	addFeedbackClassifications,
	getFeedbackClassifications,
	getDefaultFeedbackClassifications,
	patchFeedbackClassifications,
	patchDefaultFeedbackClassifications,
} from "services/clients/sites/siteApplications/feedbackClassifications";
//Actions
import {
	addActions,
	getActions,
	patchActions,
} from "services/clients/sites/siteApplications/actions";

const differentAPIs = {
	StopReasonsAPIs: {
		getAPI: getStopReasons,
		postAPI: addStopReasons,
		patchAPI: patchStopReasons,
		deleteAPI: `${BASE_API_PATH}StopReasons`,
	},
	ModelTypesAPIs: {
		getAPI: getModelTypes,
		postAPI: addModelTypes,
		patchAPI: patchModelTypes,
		deleteAPI: `${BASE_API_PATH}modeltypes`,
	},
	SkippedTasksAPIs: {
		getAPI: getSkippedTasks,
		postAPI: addSkippedTasks,
		patchAPI: patchSkippedTasks,
		deleteAPI: `${BASE_API_PATH}SkipTaskReasons`,
	},
	MissingPartAPIs: {
		getAPI: getMissingPartorToolReasons,
		postAPI: addMissingPartorToolReasons,
		patchAPI: patchMissingPartorToolReasons,
		deleteAPI: `${BASE_API_PATH}MissingPartToolReasons`,
	},
	StatusChangesAPIs: {
		getAPI: getStatusChanges,
		postAPI: addStatusChanges,
		patchAPI: patchStatusChanges,
		deleteAPI: `${BASE_API_PATH}changestatusreasons`,
	},

	FeedbackClassificationsAPIs: {
		getAPI: getFeedbackClassifications,
		getDefaultAPI: getDefaultFeedbackClassifications,
		postAPI: addFeedbackClassifications,
		patchAPI: patchFeedbackClassifications,
		patchDefaultAPI: patchDefaultFeedbackClassifications,
		deleteAPI: `${BASE_API_PATH}feedbackclassifications`,
	},
	ActionsAPIs: {
		getAPI: getActions,
		postAPI: addActions,
		patchAPI: patchActions,
		deleteAPI: `${BASE_API_PATH}actions`,
	},
};

export default differentAPIs;
