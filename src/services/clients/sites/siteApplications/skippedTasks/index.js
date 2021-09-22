import API from "helpers/api";
import { Apis } from "services/api";
import { getAPIResponse } from "helpers/getApiResponse";

//#region get stop reasons
const getSkippedTasks = async (id) => {
	try {
		let response = await API.get(`${Apis.SkippedTasks}?siteAppId=${id}`);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};

//#endregion

//#region patch stop reasons
const patchSkippedTasks = async (id, requestData) => {
	try {
		let response = await API.patch(`${Apis.SkippedTasks}/${id}`, requestData);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};

//#endregion

//#region patch stop reasons

const addSkippedTasks = async (requestData) => {
	try {
		let response = await API.post(Apis.SkippedTasks, requestData);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};

//#endregion

export { getSkippedTasks, patchSkippedTasks, addSkippedTasks };
