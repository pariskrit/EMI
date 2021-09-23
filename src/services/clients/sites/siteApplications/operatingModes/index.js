import API from "helpers/api";
import { Apis } from "services/api";
import { getAPIResponse } from "helpers/getApiResponse";

const getOperatingModes = async (id) => {
	try {
		let response = await API.get(`${Apis.OperatingModes}?siteAppId=${id}`);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};

const addOperatingModes = async (payload) => {
	try {
		let response = await API.post(`${Apis.OperatingModes}`, payload);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};

const updateOperatingModes = async (id, payload) => {
	try {
		let response = await API.patch(`${Apis.OperatingModes}/${id}`, payload);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};

export { getOperatingModes, addOperatingModes, updateOperatingModes };
