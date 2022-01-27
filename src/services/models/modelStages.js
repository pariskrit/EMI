import API from "helpers/api";
import { Apis } from "services/api";
import { getAPIResponse } from "helpers/getApiResponse";

const getModelStatus = async (id) => {
	try {
		let response = await API.get(`${Apis.ModelStages}?modelVersionId=${id}`);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};

const postModelStatus = async (data) => {
	try {
		let response = await API.post(`${Apis.ModelStages}`, data);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};

const editModelStatus = async (id, data) => {
	try {
		let response = await API.patch(`${Apis.ModelStages}/${id}`, data);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};

const uploadModelStatusImage = async (id, data) => {
	try {
		let response = await API.post(
			`${Apis.ModelStages}/${id}/uploadImage`,
			data
		);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};

export {
	getModelStatus,
	postModelStatus,
	editModelStatus,
	uploadModelStatusImage,
};
