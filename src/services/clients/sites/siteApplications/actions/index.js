import API from "helpers/api";
import { Apis } from "services/api";
import { getAPIResponse } from "helpers/getApiResponse";

//#region get stop reasons
const getActions = async (id) => {
	try {
		let response = await API.get(`${Apis.Actions}?siteAppId=${id}`);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};

//#endregion

//#region patch stop reasons
const patchActions = async (id, requestData) => {
	try {
		let response = await API.patch(`${Apis.Actions}/${id}`, requestData);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};

//#endregion

//#region patch stop reasons

const addActions = async (requestData) => {
	try {
		let response = await API.post(Apis.Actions, requestData);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};

//#endregion

export { getActions, patchActions, addActions };
