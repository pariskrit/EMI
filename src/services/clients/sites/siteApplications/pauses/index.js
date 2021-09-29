import API from "helpers/api";
import { Apis } from "services/api";
import { getAPIResponse } from "helpers/getApiResponse";

const getPauses = async (id) => {
	try {
		let response = await API.get(`${Apis.Pauses}?siteAppId=${id}`);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};

const addPauses = async (payload) => {
	try {
		let response = await API.post(`${Apis.Pauses}`, payload);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};

const updatePauses = async (id, payload) => {
	try {
		let response = await API.patch(`${Apis.Pauses}/${id}`, payload);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};

export { getPauses, addPauses, updatePauses };
