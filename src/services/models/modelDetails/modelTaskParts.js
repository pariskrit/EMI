import API from "helpers/api";
import { Apis } from "services/api";
import { getAPIResponse } from "helpers/getApiResponse";

const getModelTaskParts = async (modelVersionTaskId) => {
	try {
		let response = await API.get(
			`${Apis.ModelVersionTaskParts}?modelVersionTaskId=${modelVersionTaskId}`
		);
		return getAPIResponse(response);
	} catch (error) {
		return getAPIResponse(error?.response);
	}
};

const addModelTaskPart = async (payload) => {
	try {
		let response = await API.post(`${Apis.ModelVersionTaskParts}`, payload);
		return getAPIResponse(response);
	} catch (error) {
		return getAPIResponse(error?.response);
	}
};

const patchModelTaskPart = async (ModelVersionTaskPartID, payload) => {
	try {
		let response = await API.patch(
			`${Apis.ModelVersionTaskParts}/${ModelVersionTaskPartID}`,
			payload
		);
		return getAPIResponse(response);
	} catch (error) {
		return getAPIResponse(error?.response);
	}
};
const removeModelTaskPart = async (ModelVersionTaskPartID) => {
	try {
		let response = await API.delete(
			`${Apis.ModelVersionTaskParts}/${ModelVersionTaskPartID}`
		);
		return getAPIResponse(response);
	} catch (error) {
		return getAPIResponse(error?.response);
	}
};
export {
	getModelTaskParts,
	addModelTaskPart,
	patchModelTaskPart,
	removeModelTaskPart,
};
