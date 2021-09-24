import API from "helpers/api";
import { Apis } from "services/api";
import { getAPIResponse } from "helpers/getApiResponse";

//#region get stop reasons
const getSystems = async (id) => {
	try {
		let response = await API.get(`${Apis.Systems}?siteAppId=${id}`);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};

//#endregion

//#region patch stop reasons
const patchSystems = async (id, requestData) => {
	try {
		let response = await API.patch(`${Apis.Systems}/${id}`, requestData);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};

//#endregion

//#region patch stop reasons

const addSystems = async (requestData) => {
	try {
		let response = await API.post(Apis.Systems, requestData);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};

//#endregion

export { getSystems, patchSystems, addSystems };
