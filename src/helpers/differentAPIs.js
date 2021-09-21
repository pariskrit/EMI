import {
	getStopReasons,
	addStopReasons,
	patchStopReasons,
} from "services/clients/sites/siteApplications/stopReasons";
import { BASE_API_PATH } from "helpers/constants";

const differentAPIs = {
	StopReasonsAPIs: {
		getAPI: getStopReasons,
		postAPI: addStopReasons,
		patchAPI: patchStopReasons,
		deleteAPI: `${BASE_API_PATH}StopReasons`,
	},
};

export default differentAPIs;
