import API from "helpers/api";
import { Apis } from "services/api";
import { getAPIResponse } from "helpers/getApiResponse";

//#region get stop reasons
const getStopReasons = async (id) => {
	try {
		let response = await API.get(`${Apis.StopReasons}?siteAppId=${id}`);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};

//#endregion

//#region patch stop reasons
const patchStopReasons = async (id, requestData) => {
	try {
		let response = await API.patch(`${Apis.StopReasons}/${id}`, requestData);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};

//#endregion

//#region patch stop reasons
const deleteStopReasons = async (id) => {
	try {
		let response = await API.delete(`${Apis.StopReasons}/${id}`);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};

//#endregion

const addStopReasons = async (requestData) => {
	try {
		let response = await API.post(Apis.StopReasons, requestData);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};

export { getStopReasons, patchStopReasons, deleteStopReasons, addStopReasons };
