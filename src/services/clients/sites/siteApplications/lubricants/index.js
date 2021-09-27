import API from "helpers/api";
import { Apis } from "services/api";
import { getAPIResponse } from "helpers/getApiResponse";

//#region get stop reasons
const getLubricants = async (id) => {
	try {
		let response = await API.get(`${Apis.Lubricants}?siteAppId=${id}`);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};

//#endregion

//#region patch stop reasons
const patchLubricants = async (id, requestData) => {
	try {
		let response = await API.patch(`${Apis.Lubricants}/${id}`, requestData);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};

//#endregion

//#region patch stop reasons

const addLubricants = async (requestData) => {
	try {
		let response = await API.post(Apis.Lubricants, requestData);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};

//#endregion

export { getLubricants, patchLubricants, addLubricants };
