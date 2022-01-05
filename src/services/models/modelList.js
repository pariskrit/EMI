import API from "helpers/api";
import { Apis } from "services/api";
import { getAPIResponse } from "helpers/getApiResponse";

//#region get users detail
const getModelList = async (id) => {
	try {
		let response = await API.get(`${Apis.Models}?siteAppId=${id}`);
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
		console.log(response);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};

const getListOfModelVersions = async (id) => {
	try {
		let response = await API.get(`${Apis.ModelVersions}?modelId=${id}`);
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
};