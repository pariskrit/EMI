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
};

export default differentAPIs;
