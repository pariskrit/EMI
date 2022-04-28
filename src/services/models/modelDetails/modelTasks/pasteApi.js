import API from "helpers/api";
import { Apis } from "services/api";
import { getAPIResponse } from "helpers/getApiResponse";

export const pasteModelTaskPart = async (id, data) => {
	try {
		let response = await API.post(`${Apis.ModelTasks}/${id}/PastePart`, data);
		return getAPIResponse(response);
	} catch (error) {
		return getAPIResponse(error?.response);
	}
};

export const pasteModelTaskTool = async (id, data) => {
	try {
		let response = await API.post(`${Apis.ModelTasks}/${id}/PasteTool`, data);
		return getAPIResponse(response);
	} catch (error) {
		return getAPIResponse(error?.response);
	}
};

export const pasteModelTaskPermit = async (id, data) => {
	try {
		let response = await API.post(`${Apis.ModelTasks}/${id}/PastePermit`, data);
		return getAPIResponse(response);
	} catch (error) {
		return getAPIResponse(error?.response);
	}
};

export const pasteModelTaskImage = async (id, data) => {
	try {
		let response = await API.post(`${Apis.ModelTasks}/${id}/PasteImage`, data);
		return getAPIResponse(response);
	} catch (error) {
		return getAPIResponse(error?.response);
	}
};

export const pasteModelTaskDocument = async (id, data) => {
	try {
		let response = await API.post(
			`${Apis.ModelTasks}/${id}/PasteDocument`,
			data
		);
		return getAPIResponse(response);
	} catch (error) {
		return getAPIResponse(error?.response);
	}
};
