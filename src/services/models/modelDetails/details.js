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

export const getModelLists = async (id) => {
	try {
		let response = await API.get(`${Apis.Models}?siteAppId=${id}`);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};

export const patchModelChange = async (id, payload) => {
	try {
		let response = await API.patch(`${Apis.Models}/${id}`, payload);
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
		let response = await API.get(
			`${Apis.ModelVersionDepartments}?modelVersionId=${id}`
		);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};

export const getAvailabeleModelDeparments = async (id) => {
	try {
		let response = await API.get(
			`${Apis.ModelVersionDepartments}/available?modelVersionId=${id}`
		);
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

export const uploadImageToS3 = async (id, payload, config) => {
	try {
		let response = await API.post(
			`${Apis.ModelVersions}/${id}/UploadImage`,
			payload,
			config
		);

		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};

export const uploadDocument = async (payload, config = {}) => {
	try {
		let response = await API.post(`${Apis.ModelDocuments}`, payload, config);

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
		let response = await API.post(`${Apis.ModelVersionDepartments}`, payload);

		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};

export const deleteModelDepartment = async (id) => {
	try {
		let response = await API.delete(`${Apis.ModelVersionDepartments}/${id}`);

		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};

export const postNewModelVersion = async (modelVersionId) => {
	try {
		let response = await API.post(`${Apis.ModelVersions}`, { modelVersionId });

		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};

export const revertVersion = async (id) => {
	try {
		let response = await API.post(`${Apis.ModelVersions}/${id}/revert`);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};
