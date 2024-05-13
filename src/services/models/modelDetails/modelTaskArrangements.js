import API from "helpers/api";
import { Apis } from "services/api";
import { getAPIResponse } from "helpers/getApiResponse";

export const getModelVersionTaskArrangements = async (id) => {
	try {
		let response = await API.get(
			`${Apis.ModelVersionTaskArrangements}?modelVersionTaskId=${id}`
		);
		return getAPIResponse(response);
	} catch (error) {
		return getAPIResponse(error?.response);
	}
};

export const checkSelected = async (payload) => {
	try {
		let response = await API.post(
			`${Apis.ModelVersionTaskArrangements}`,
			payload
		);
		return getAPIResponse(response);
	} catch (error) {
		return getAPIResponse(error?.response);
	}
};
export const unCheckSelected = async (id) => {
	try {
		let response = await API.delete(
			`${Apis.ModelVersionTaskArrangements}/${id}`
		);
		return getAPIResponse(response);
	} catch (error) {
		return getAPIResponse(error?.response);
	}
};
