import API from "helpers/api";
import { Apis } from "services/api";
import { getAPIResponse } from "helpers/getApiResponse";

//#region get cc
const getCustomCaptions = async (id) => {
	try {
		let response = await API.get(`${Apis.Applications}/${id}`);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};

//#endregion

//#region get cc
const getDefaultCustomCaptions = async (id) => {
	try {
		let response = await API.get(`/api/applications/${id}/customcaptions`);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};

//#endregion

//#region patch cc
const patchCustomCaptions = async (id, requestData) => {
	try {
		let response = await API.patch(`${Apis.Applications}/${id}`, requestData);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};

//#endregion

export { getCustomCaptions, patchCustomCaptions, getDefaultCustomCaptions };
