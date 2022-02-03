import API from "helpers/api";
import { Apis } from "services/api";
import { getAPIResponse } from "helpers/getApiResponse";

// get list of model zones
const getModelAsset = async (modelId) => {
	try {
		let response = await API.get(`${Apis.ModelAssets}?modelId=${modelId}`);
		return getAPIResponse(response);
	} catch (error) {
		return getAPIResponse(error?.response);
	}
};

const postModelAsset = async (data) => {
	try {
		let response = await API.post(`${Apis.ModelAssets}`, data);
		return getAPIResponse(response);
	} catch (error) {
		return getAPIResponse(error?.response);
	}
};

export { getModelAsset, postModelAsset };
