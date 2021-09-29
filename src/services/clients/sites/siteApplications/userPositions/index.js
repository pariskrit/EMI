import API from "helpers/api";
import { Apis } from "services/api";
import { getAPIResponse } from "helpers/getApiResponse";

const getPositions = async (id) => {
	try {
		let response = await API.get(`${Apis.positions}?siteAppId=${id}`);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};

const addPosition = async (payload) => {
	try {
		let response = await API.post(`${Apis.positions}`, payload);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};

const updatePosition = async (id, payload) => {
	try {
		let response = await API.patch(`${Apis.positions}/${id}`, payload);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};

export { getPositions, addPosition, updatePosition };
