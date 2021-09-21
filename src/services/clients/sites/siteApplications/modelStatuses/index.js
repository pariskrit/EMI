import API from "helpers/api";
import { Apis } from "services/api";
import { getAPIResponse } from "helpers/getApiResponse";

const getModelStatuses = async (id) => {
	try {
		let response = await API.get(`${Apis.ModelStatuses}?siteAppId=${id}`);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};

const patchModelStatuses = async (id, requestData) => {
	try {
		let response = await API.patch(`${Apis.ModelStatuses}/${id}`, requestData);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};

const addModelStatuses = async (requestData) => {
	try {
		let response = await API.post(Apis.ModelStatuses, requestData);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};

export { getModelStatuses, patchModelStatuses, addModelStatuses };
