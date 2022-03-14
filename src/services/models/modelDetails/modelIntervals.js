import API from "helpers/api";
import { Apis } from "services/api";
import { getAPIResponse } from "helpers/getApiResponse";

// get list of model zones
export const getModelIntervals = async (id) => {
	try {
		let response = await API.get(`${Apis.ModelIntervals}?modelVersionId=${id}`);
		return getAPIResponse(response);
	} catch (error) {
		return getAPIResponse(error?.response);
	}
};

export const getModelIntervalsToEdit = async (id) => {
	try {
		let response = await API.get(`${Apis.ModelIntervals}/${id}`);
		return getAPIResponse(response);
	} catch (error) {
		return getAPIResponse(error?.response);
	}
};

export const addModelIntervals = async (payload) => {
	try {
		let response = await API.post(`${Apis.ModelIntervals}`, payload);
		return getAPIResponse(response);
	} catch (error) {
		return getAPIResponse(error?.response);
	}
};

export const deleteModelIntervals = async (id) => {
	try {
		let response = await API.delete(`${Apis.ModelIntervals}/${id}`);
		return getAPIResponse(response);
	} catch (error) {
		return getAPIResponse(error?.response);
	}
};

export const updateModelIntervals = async (id, payload) => {
	try {
		let response = await API.patch(`${Apis.ModelIntervals}/${id}`, payload);
		return getAPIResponse(response);
	} catch (error) {
		return getAPIResponse(error?.response);
	}
};

export const updateModelIntervalsTaskList = async (id, payload) => {
	try {
		let response = await API.patch(`${Apis.ModelTaskList}/${id}`, payload);
		return getAPIResponse(response);
	} catch (error) {
		return getAPIResponse(error?.response);
	}
};

export const addModelIntervalsTaskList = async (payload) => {
	try {
		let response = await API.post(`${Apis.ModelTaskList}`, payload);
		return getAPIResponse(response);
	} catch (error) {
		return getAPIResponse(error?.response);
	}
};

export const deleteModelIntervalsTaskList = async (id) => {
	try {
		let response = await API.delete(`${Apis.ModelTaskList}/${id}`);
		return getAPIResponse(response);
	} catch (error) {
		return getAPIResponse(error?.response);
	}
};

export const deleteModelIntervalsInclude = async (id) => {
	try {
		let response = await API.delete(
			`${Apis.ModelVersionIntervalInclude}/${id}`
		);
		return getAPIResponse(response);
	} catch (error) {
		return getAPIResponse(error?.response);
	}
};

export const addModelIntervalsInclude = async (payload) => {
	try {
		let response = await API.post(
			`${Apis.ModelVersionIntervalInclude}`,
			payload
		);
		return getAPIResponse(response);
	} catch (error) {
		return getAPIResponse(error?.response);
	}
};

export const dragAndDropModelIntervals = async (id, payload) => {
	try {
		let response = await API.patch(`${Apis.ModelIntervals}/${id}`, payload);
		return getAPIResponse(response);
	} catch (error) {
		return getAPIResponse(error?.response);
	}
};
