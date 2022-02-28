import API from "helpers/api";
import { Apis } from "services/api";
import { getAPIResponse } from "helpers/getApiResponse";

const getModelTaskTools = async (modelVersionTaskId) => {
	try {
		let response = await API.get(
			`${Apis.ModelVersionTaskTools}?modelVersionTaskId=${modelVersionTaskId}`
		);
		return getAPIResponse(response);
	} catch (error) {
		return getAPIResponse(error?.response);
	}
};

const addModelTaskTool = async (payload) => {
	try {
		let response = await API.post(`${Apis.ModelVersionTaskTools}`, payload);
		return getAPIResponse(response);
	} catch (error) {
		return getAPIResponse(error?.response);
	}
};

const patchModelTaskTool = async (ModelVersionTaskToolID, payload) => {
	try {
		let response = await API.patch(
			`${Apis.ModelVersionTaskTools}/${ModelVersionTaskToolID}`,
			payload
		);
		return getAPIResponse(response);
	} catch (error) {
		return getAPIResponse(error?.response);
	}
};
const removeModelTaskTool = async (ModelVersionTaskToolID) => {
	try {
		let response = await API.delete(
			`${Apis.ModelVersionTaskTools}/${ModelVersionTaskToolID}`
		);
		return getAPIResponse(response);
	} catch (error) {
		return getAPIResponse(error?.response);
	}
};
export {
	getModelTaskTools,
	addModelTaskTool,
	patchModelTaskTool,
	removeModelTaskTool,
};
