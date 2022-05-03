import API from "helpers/api";
import { Apis } from "services/api";
import { getAPIResponse } from "helpers/getApiResponse";

//#region get users detail
export const getUserSites = async (id) => {
	try {
		let response = await API.get(`${Apis.userDetailSites}/${id}/access`);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};

export const postClientUserSite = async (payload) => {
	try {
		let response = await API.post(`${Apis.clientUserSites}`, payload);
		return getAPIResponse(response);
	} catch (error) {
		return getAPIResponse(error?.response);
	}
};

export const deleteClientUserSite = async (userSiteId) => {
	try {
		let response = await API.delete(`${Apis.clientUserSites}/${userSiteId}`);
		return getAPIResponse(response);
	} catch (error) {
		return getAPIResponse(error?.response);
	}
};

export const postClientUserSiteApps = async (payload) => {
	try {
		let response = await API.post(`${Apis.ClientUserSitesApps}`, payload);
		return getAPIResponse(response);
	} catch (error) {
		return getAPIResponse(error?.response);
	}
};

export const updateClientUserSiteAppsStatus = async (id, payload) => {
	try {
		let response = await API.patch(
			`${Apis.ClientUserSitesApps}/${id}`,
			payload
		);
		return getAPIResponse(response);
	} catch (error) {
		return getAPIResponse(error?.response);
	}
};
