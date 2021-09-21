import { BASE_API_PATH } from "helpers/constants";

//Stop Reasons
import {
	getStopReasons,
	addStopReasons,
	patchStopReasons,
} from "services/clients/sites/siteApplications/stopReasons";

//Skipped Tasks
import {
	getSkippedTasks,
	addSkippedTasks,
	patchSkippedTasks,
} from "services/clients/sites/siteApplications/skippedTasks";

//Missing Part or Tool Reasons
import {
	getMissingPartorToolReasons,
	addMissingPartorToolReasons,
	patchMissingPartorToolReasons,
} from "services/clients/sites/siteApplications/missingPartorToolReasons";

//Status Changes
import {
	getStatusChanges,
	addStatusChanges,
	patchStatusChanges,
} from "services/clients/sites/siteApplications/statusChanges";

const differentAPIs = {
	StopReasonsAPIs: {
		getAPI: getStopReasons,
		postAPI: addStopReasons,
		patchAPI: patchStopReasons,
		deleteAPI: `${BASE_API_PATH}StopReasons`,
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
};

export default differentAPIs;
