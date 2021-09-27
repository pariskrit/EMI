import API from "helpers/api";
import { Apis } from "services/api";
import { getAPIResponse } from "helpers/getApiResponse";

//#region get stop reasons
const getStatusChanges = async (id) => {
	try {
		let response = await API.get(`${Apis.StatusChanges}?siteAppId=${id}`);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};

//#endregion

//#region patch stop reasons
const patchStatusChanges = async (id, requestData) => {
	try {
		let response = await API.patch(`${Apis.StatusChanges}/${id}`, requestData);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};

//#endregion

//#region patch stop reasons

const addStatusChanges = async (requestData) => {
	try {
		let response = await API.post(Apis.StatusChanges, requestData);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};

//#endregion

export { getStatusChanges, patchStatusChanges, addStatusChanges };
