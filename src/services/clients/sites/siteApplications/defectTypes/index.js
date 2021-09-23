import API from "helpers/api";
import { Apis } from "services/api";
import { getAPIResponse } from "helpers/getApiResponse";

//#region get stop reasons
const getDefectTypes = async (id) => {
	try {
		let response = await API.get(`${Apis.DefectTypes}?siteAppId=${id}`);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};

//#endregion

//#region patch stop reasons
const patchDefectTypes = async (id, requestData) => {
	try {
		let response = await API.patch(`${Apis.DefectTypes}/${id}`, requestData);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};

//#endregion

//#region patch stop reasons

const addDefectTypes = async (requestData) => {
	try {
		let response = await API.post(Apis.DefectTypes, requestData);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};

//#endregion

export { getDefectTypes, patchDefectTypes, addDefectTypes };
