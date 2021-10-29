import API from "helpers/api";
import { getAPIResponse } from "helpers/getApiResponse";
import { Apis } from "services/api";

export const getClientList = async (id) => {
	try {
		let response = await API.get(`${Apis.ApplicationPortal}?clientId=${id}`);
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
