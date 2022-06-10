import API from "helpers/api";
import { Apis } from "services/api";
import { getAPIResponse } from "helpers/getApiResponse";

export const getStatusChanges = async (serviceId) => {
	try {
		let response = await API.get(`${Apis.Services}/${serviceId}/statuschanges`);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};

export const getPauses = async (serviceId) => {
	try {
		let response = await API.get(`${Apis.Services}/${serviceId}/pauses`);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};

export const getMissingPartsTools = async (serviceId) => {
	try {
		let response = await API.get(
			`${Apis.Services}/${serviceId}/missingpartstools`
		);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};

export const getSkippedTasks = async (serviceId) => {
	try {
		let response = await API.get(`${Apis.Services}/${serviceId}/skippedtasks`);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};

export const getStops = async (serviceId) => {
	try {
		let response = await API.get(`${Apis.Services}/${serviceId}/stops`);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};
