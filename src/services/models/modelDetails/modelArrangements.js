import { getAPIResponse } from "helpers/getApiResponse";
import { Apis } from "services/api";
import API from "helpers/api";

const getModelArrangements = async (modelVersionId) => {
	try {
		let response = await API.get(
			`${Apis.ModelVersionArrangements}?modelVersionId=${modelVersionId}`
		);
		return getAPIResponse(response);
	} catch (error) {
		return getAPIResponse(error?.response);
	}
};

const getModelVersionAvailableArrangments = async (modelId) => {
	try {
		let response = await API.get(
			`${Apis.ModelVersionArrangements}/available?modelId=${modelId}`
		);
		return getAPIResponse(response);
	} catch (error) {
		return getAPIResponse(error?.response);
	}
};

export { getModelArrangements, getModelVersionAvailableArrangments };
