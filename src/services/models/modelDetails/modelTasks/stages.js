import API from "helpers/api";
import { Apis } from "services/api";
import { getAPIResponse } from "helpers/getApiResponse";

// get list of model stages
const getStages = async (taskId) => {
	try {
		let response = await API.get(
			`${Apis.ModelTaskStages}?modelVersionTaskId=${taskId}`
		);
		return getAPIResponse(response);
	} catch (error) {
		return getAPIResponse(error?.response);
	}
};

const postStages = async (data) => {
	try {
		let response = await API.post(`${Apis.ModelTaskStages}`, data);
		return getAPIResponse(response);
	} catch (error) {
		return getAPIResponse(error?.response);
	}
};

const deleteStages = async (id) => {
	try {
		let response = await API.delete(`${Apis.ModelTaskStages}/${id}`);
		return getAPIResponse(response);
	} catch (error) {
		return getAPIResponse(error?.response);
	}
};

const patchStages = async (id, data) => {
	try {
		let response = await API.patch(`${Apis.ModelTaskStages}/${id}`, data);
		return getAPIResponse(response);
	} catch (error) {
		return getAPIResponse(error?.response);
	}
};

export { getStages, postStages, patchStages, deleteStages };
