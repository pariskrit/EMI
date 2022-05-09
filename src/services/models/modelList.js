import API from "helpers/api";
import { Apis } from "services/api";
import { getAPIResponse } from "helpers/getApiResponse";

const getModelList = async (id, search = "") => {
	try {
		let response = await API.get(
			`${Apis.Models}?siteAppId=${id}&search=${search}`
		);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};

const getPublishedModel = async (id) => {
	try {
		let response = await API.get(`${Apis.Models}/published?siteAppId=${id}`);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};

const addModal = async (payload) => {
	try {
		let response = await API.post(`${Apis.Models}`, payload);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};

const duplicateModal = async (payload) => {
	try {
		let response = await API.post(`${Apis.DuplicateModal}`, payload);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};

const getListOfModelVersions = async (id) => {
	try {
		let response = await API.get(`${Apis.Models}/${id}/${Apis.Versions}`);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};

const getModelImports = async (id) => {
	try {
		let response = await API.get(`${Apis.ModelImports}?siteAppId=${id}`);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};

export {
	getModelList,
	addModal,
	duplicateModal,
	getListOfModelVersions,
	getModelImports,
	getPublishedModel,
};
