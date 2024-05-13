import API from "helpers/api";
import { getAPIResponse } from "helpers/getApiResponse";
import { Apis } from "services/api";

export const getClientList = async () => {
	try {
		let response = await API.get(`${Apis.ApplicationPortal}`);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};

export const getApplicationsAndSites = async (id) => {
	try {
		let response = await API.get(`${Apis.ApplicationsAndSites}?clientId=${id}`);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};

export const ClientAdminLogin = async (clientId) => {
	try {
		let response = await API.get(`${Apis.ClientAdmin}/${clientId}`);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};
