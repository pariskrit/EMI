import API from "helpers/api";
import { Apis } from "services/api";
import { getAPIResponse } from "helpers/getApiResponse";

//#region get stop reasons
const getMissingPartorToolReasons = async (id) => {
	try {
		let response = await API.get(
			`${Apis.MissingPartorToolReasons}?siteAppId=${id}`
		);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};

//#endregion

//#region patch stop reasons
const patchMissingPartorToolReasons = async (id, requestData) => {
	try {
		let response = await API.patch(
			`${Apis.MissingPartorToolReasons}/${id}`,
			requestData
		);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};

//#endregion

//#region patch stop reasons

const addMissingPartorToolReasons = async (requestData) => {
	try {
		let response = await API.post(Apis.MissingPartorToolReasons, requestData);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};

//#endregion

export {
	getMissingPartorToolReasons,
	patchMissingPartorToolReasons,
	addMissingPartorToolReasons,
};
