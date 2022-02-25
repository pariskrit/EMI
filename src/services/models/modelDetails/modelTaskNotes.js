import API from "helpers/api";
import { Apis } from "services/api";
import { getAPIResponse } from "helpers/getApiResponse";

const getModelTaskNotes = async (modelId, taskGroupID) => {
	try {
		let response = await API.get(
			`${Apis.ModelTaskNotes}?modelId=${modelId}&taskGroupId=${taskGroupID}`
		);
		return getAPIResponse(response);
	} catch (error) {
		return getAPIResponse(error?.response);
	}
};

const addModelTaskNote = async (payload) => {
	try {
		let response = await API.post(`${Apis.ModelTaskNotes}`, payload);
		return getAPIResponse(response);
	} catch (error) {
		return getAPIResponse(error?.response);
	}
};

export { getModelTaskNotes, addModelTaskNote };
