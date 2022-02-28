import API from "helpers/api";
import { Apis } from "services/api";
import { getAPIResponse } from "helpers/getApiResponse";

const getModelTaskPermits = async (modelVersionTaskId) => {
	try {
		let response = await API.get(
			`${Apis.ModelVersionTaskPermits}?modelVersionTaskId=${modelVersionTaskId}`
		);
		return getAPIResponse(response);
	} catch (error) {
		return getAPIResponse(error?.response);
	}
};

const addModelTaskPermit = async (payload) => {
	try {
		let response = await API.post(`${Apis.ModelVersionTaskPermits}`, payload);
		return getAPIResponse(response);
	} catch (error) {
		return getAPIResponse(error?.response);
	}
};

const patchModelTaskPermit = async (ModelVersionTaskPermitID, payload) => {
	try {
		let response = await API.patch(
			`${Apis.ModelVersionTaskPermits}/${ModelVersionTaskPermitID}`,
			payload
		);
		return getAPIResponse(response);
	} catch (error) {
		return getAPIResponse(error?.response);
	}
};
const removeModelTaskPermit = async (ModelVersionTaskPermitID) => {
	try {
		let response = await API.delete(
			`${Apis.ModelVersionTaskPermits}/${ModelVersionTaskPermitID}`
		);
		return getAPIResponse(response);
	} catch (error) {
		return getAPIResponse(error?.response);
	}
};
export {
	getModelTaskPermits,
	addModelTaskPermit,
	patchModelTaskPermit,
	removeModelTaskPermit,
};
