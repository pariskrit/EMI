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

const getSiteApplicationDetail = async (id) => {
	try {
		let response = await API.get(`${Apis.Applications}/${id}`);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};

const patchApplicationDetail = async (id, payload) => {
	try {
		let response = await API.get(`${Apis.Applications}/${id}`, payload);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};

export {
	getCustomCaptions,
	patchCustomCaptions,
	getSiteApplicationDetail,
	patchApplicationDetail,
};
