import API from "helpers/api";
import { Apis } from "services/api";
import { getAPIResponse } from "helpers/getApiResponse";

export const getClientUserSiteAppAccess = async (id) => {
	try {
		let response = await API.get(`${Apis.ClientUserSiteApps}/${id}/access`);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};

export const updateClientUserSiteAppAccess = async (id, payload) => {
	try {
		let response = await API.patch(`${Apis.ClientUserSiteApps}/${id}`, payload);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};

export const getClientSites = async (id) => {
	try {
		let response = await API.get(`${Apis.ClientSites}/${id}/sites`);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};

export const getClientUserSiteApps = async (id) => {
	try {
		let response = await API.get(`${Apis.ClientUserSites}/${id}/siteapps`);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};

export const updateClientUserSite = async (id, payload) => {
	try {
		let response = await API.patch(`${Apis.ClientUserSites}/${id}`, payload);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};

export const checkUserDepartments = async (payload) => {
	try {
		let response = await API.post(
			`${Apis.ClientUserSiteAppServiceDeparments}`,
			payload
		);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};

export const uncheckUserDepartments = async (id) => {
	try {
		let response = await API.delete(
			`${Apis.ClientUserSiteAppServiceDeparments}/${id}`
		);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};

export const checkUserRoles = async (payload) => {
	try {
		let response = await API.post(
			`${Apis.ClientUserSiteAppServiceRoles}`,
			payload
		);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};

export const uncheckUserRoles = async (id) => {
	try {
		let response = await API.delete(
			`${Apis.ClientUserSiteAppServiceRoles}/${id}`
		);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};

export const checkUserModels = async (payload) => {
	try {
		let response = await API.post(
			`${Apis.ClientUserSiteAppServiceModels}`,
			payload
		);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};

export const uncheckUserModels = async (id) => {
	try {
		let response = await API.delete(
			`${Apis.ClientUserSiteAppServiceModels}/${id}`
		);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};

export const deleteAtTickAll = async (id) => {
	try {
		let response = await API.delete(
			`${Apis.ClientUserSiteApps}/${id}/servicemodels`
		);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};
