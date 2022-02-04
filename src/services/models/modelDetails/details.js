import API from "helpers/api";
import { Apis } from "services/api";
import { getAPIResponse } from "helpers/getApiResponse";

export const getModelDetails = async (id) => {
	try {
		let response = await API.get(`${Apis.ModelVersions}/${id}`);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};

export const getModelTypes = async (id) => {
	try {
		let response = await API.get(`${Apis.ModelTypes}?siteAppId=${id}`);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};

export const getModelDeparments = async (id) => {
	try {
		let response = await API.get(`${Apis.ModelDepartments}?modelId=${id}`);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};

export const getModelNotes = async (id) => {
	try {
		let response = await API.get(`${Apis.ModelNotes}?modelId=${id}`);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};

export const deleteModelNotes = async (id) => {
	try {
		let response = await API.delete(`${Apis.ModelNotes}/${id}`);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};

export const addModelNotes = async (payload) => {
	try {
		let response = await API.post(`${Apis.ModelNotes}`, payload);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};

export const getModelDocuments = async (id) => {
	try {
		let response = await API.get(`${Apis.ModelDocuments}?modelId=${id}`);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};

export const getModelStatuses = async (id) => {
	try {
		let response = await API.get(`${Apis.ModelStatuses}?siteAppId=${id}`);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};

export const getSiteDepartments = async (id) => {
	try {
		let response = await API.get(`${Apis.SiteDepartments}?siteAppId=${id}`);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};

export const updateModel = async (id, payload) => {
	try {
		let response = await API.patch(`${Apis.ModelVersions}/${id}`, payload);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};

export const uploadImageToS3 = async (id, payload) => {
	try {
		let response = await API.post(
			`${Apis.ModelVersions}/${id}/UploadImage`,
			payload
		);

		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};

export const uploadDocument = async (payload) => {
	try {
		let response = await API.post(`${Apis.ModelDocuments}`, payload);

		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};

export const deleteDocument = async (id) => {
	try {
		let response = await API.delete(`${Apis.ModelDocuments}/${id}`);

		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};

export const addModelDepartment = async (payload) => {
	try {
		let response = await API.post(`${Apis.ModelDepartments}`, payload);

		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};

export const deleteModelDepartment = async (id) => {
	try {
		let response = await API.delete(`${Apis.ModelDepartments}/${id}`);

		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};
