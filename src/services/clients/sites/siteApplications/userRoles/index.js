import API from "helpers/api";
import { Apis } from "services/api";
import { getAPIResponse } from "helpers/getApiResponse";

//#region get stop reasons
const getRoles = async (id) => {
	try {
		let response = await API.get(`${Apis.Roles}?siteAppId=${id}`);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};

//#endregion

//#region patch stop reasons
const patchRoles = async (id, requestData) => {
	try {
		let response = await API.patch(`${Apis.Roles}/${id}`, requestData);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};

//#endregion

//#region patch stop reasons

const addRoles = async (requestData) => {
	try {
		let response = await API.post(Apis.Roles, requestData);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};

//#endregion

export { getRoles, patchRoles, addRoles };
