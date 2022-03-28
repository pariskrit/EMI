import API from "helpers/api";
import { Apis } from "services/api";
import { getAPIResponse } from "helpers/getApiResponse";

// get list of model zones
const getModelTasksList = async (modelVersionId, searchTxt = "") => {
	try {
		let response = await API.get(
			`${Apis.ModelTasks}?modelVersionId=${modelVersionId}&search=${searchTxt}`
		);
		return getAPIResponse(response);
	} catch (error) {
		return getAPIResponse(error?.response);
	}
};

const getLengthOfModelTasks = async (modelVersionId) => {
	try {
		let response = await API.get(
			`${Apis.ModelTasks}/count?modelVersionId=${modelVersionId}`
		);
		return getAPIResponse(response);
	} catch (error) {
		return getAPIResponse(error?.response);
	}
};

const getSingleModelTask = async (modelVersionTaskId) => {
	try {
		let response = await API.get(`${Apis.ModelTasks}/${modelVersionTaskId}`);
		return getAPIResponse(response);
	} catch (error) {
		return getAPIResponse(error?.response);
	}
};

const addModelTask = async (payload) => {
	try {
		let response = await API.post(`${Apis.ModelTasks}`, payload);
		return getAPIResponse(response);
	} catch (error) {
		return getAPIResponse(error?.response);
	}
};

const duplicateTask = async (taskId) => {
	try {
		let response = await API.post(`${Apis.ModelTasks}/${taskId}/Duplicate`);
		return getAPIResponse(response);
	} catch (error) {
		return getAPIResponse(error?.response);
	}
};

const pasteModelTask = async (taskId, payload) => {
	try {
		let response = await API.post(
			`${Apis.ModelVersions}/${taskId}/PasteTask`,
			payload
		);
		return getAPIResponse(response);
	} catch (error) {
		return getAPIResponse(error?.response);
	}
};

const patchModelTask = async (taskId, payload) => {
	try {
		let response = await API.patch(`${Apis.ModelTasks}/${taskId}`, payload);
		return getAPIResponse(response);
	} catch (error) {
		return getAPIResponse(error?.response);
	}
};

export {
	getModelTasksList,
	addModelTask,
	duplicateTask,
	getSingleModelTask,
	getLengthOfModelTasks,
	pasteModelTask,
	patchModelTask,
};
