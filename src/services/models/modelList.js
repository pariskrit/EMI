import API from "helpers/api";
import { Apis } from "services/api";
import { getAPIResponse } from "helpers/getApiResponse";

const getModelList = async (
	id,
	search = "",
	modelStatusId = "",
	siteDepartmentId = ""
) => {
	try {
		let response = await API.get(
			`${Apis.Models}?siteAppId=${id}&search=${search}&modelStatusId=${modelStatusId}&siteDepartmentId=${siteDepartmentId}`
		);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};
const getAvailableModelDepartments = async (id) => {
	try {
		let response = await API.get(`${Apis.SiteDepartments}?siteAppId=${id}`);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};
const getModelImportsClientList = async (id) => {
	try {
		let response = await API.get(`${Apis.ModelImports}/clients`);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};
const getClientDetail = async (id) => {
	try {
		let response = await API.get(`${Apis.Clients}/${id}`);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};
const getModelImportsSites = async (id) => {
	try {
		let response = await API.get(`${Apis.ModelImports}/sites?clientId=${id}`);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};
const getModelImportsApplications = async (id, modelType) => {
	try {
		let response = await API.get(
			`${Apis.ModelImports}/applications?siteId=${id}&modelType=${modelType}`
		);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};
const transferModel = async (payload) => {
	try {
		let response = await API.post(`${Apis.ModelImports}/transfer`, payload);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};

const getModelDepartments = async (id) => {
	try {
		let response = await API.get(`${Apis.SiteDepartments}?siteAppId=${id}`);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};

const getModelStatuses = async (id) => {
	try {
		let response = await API.get(`${Apis.ModelStatuses}?siteAppId=${id}`);
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
	getModelStatuses,
	addModal,
	getAvailableModelDepartments,
	duplicateModal,
	getListOfModelVersions,
	getModelImports,
	getPublishedModel,
	getModelDepartments,
	getModelImportsClientList,
	getModelImportsSites,
	getModelImportsApplications,
	transferModel,
	getClientDetail,
};
