import API from "helpers/api";
import { Apis } from "services/api";
import { getAPIResponse } from "helpers/getApiResponse";

export const getModelVersionTaskIntervals = async (id) => {
	try {
		let response = await API.get(
			`${Apis.ModelVersionTaskIntervals}?modelVersionTaskId=${id}`
		);
		return getAPIResponse(response);
	} catch (error) {
		return getAPIResponse(error?.response);
	}
};

export const checkSelected = async (payload) => {
	try {
		let response = await API.post(`${Apis.ModelVersionTaskIntervals}`, payload);
		return getAPIResponse(response);
	} catch (error) {
		return getAPIResponse(error?.response);
	}
};

export const unCheckSelected = async (id) => {
	try {
		let response = await API.delete(`${Apis.ModelVersionTaskIntervals}/${id}`);
		return getAPIResponse(response);
	} catch (error) {
		return getAPIResponse(error?.response);
	}
};
