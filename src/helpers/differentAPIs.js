import {
	getStopReasons,
	addStopReasons,
	patchStopReasons,
} from "services/clients/sites/siteApplications/stopReasons";
import { BASE_API_PATH } from "helpers/constants";
import {
	addModelTypes,
	getModelTypes,
	patchModelTypes,
} from "services/clients/sites/siteApplications/modelTypes";

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
};

export default differentAPIs;
