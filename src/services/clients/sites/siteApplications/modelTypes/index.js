import API from "helpers/api";
import { Apis } from "services/api";
import { getAPIResponse } from "helpers/getApiResponse";

//#region get stop reasons
const getModelTypes = async (id) => {
	try {
		let response = await API.get(`${Apis.ModelTypes}?siteAppId=${id}`);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};

//#endregion

//#region patch stop reasons
const patchModelTypes = async (id, requestData) => {
	try {
		let response = await API.patch(`${Apis.ModelTypes}/${id}`, requestData);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};

//#endregion

//#region patch stop reasons
const deleteModelTypes = async (id) => {
	try {
		let response = await API.delete(`${Apis.ModelTypes}/${id}`);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};

//#endregion

const addModelTypes = async (requestData) => {
	try {
		let response = await API.post(Apis.ModelTypes, requestData);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};

export { getModelTypes, patchModelTypes, deleteModelTypes, addModelTypes };
