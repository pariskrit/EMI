import API from "helpers/api";
import { Apis } from "services/api";
import { getAPIResponse } from "helpers/getApiResponse";

const getImages = async (taskId) => {
	try {
		let response = await API.get(
			`${Apis.ModelVersionTaskImages}?modelVersionTaskId=${taskId}`
		);
		return getAPIResponse(response);
	} catch (error) {
		return getAPIResponse(error?.response);
	}
};

const updateImage = async (id, data) => {
	try {
		let response = await API.patch(
			`${Apis.ModelVersionTaskImages}/${id}`,
			data
		);
		return getAPIResponse(response);
	} catch (error) {
		return getAPIResponse(error?.response);
	}
};

const uploadTaskImage = async (taskId, image) => {
	try {
		let response = await API.post(
			`${Apis.ModelTasks}/${taskId}/uploadImage`,
			image
		);
		return getAPIResponse(response);
	} catch (error) {
		return getAPIResponse(error?.response);
	}
};

export { getImages, updateImage, uploadTaskImage };
