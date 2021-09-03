import API from "helpers/api";
import { Apis } from "services/api";
import { getAPIResponse } from "helpers/getApiResponse";

//#region get locations
const getSiteLocations = async (siteId) => {
	try {
		let response = await API.get(`${Apis.SiteLocations}?siteId=${siteId}`);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};

//#endregion

//#region add edit locations
const addSiteLocations = async (requestData) => {
	try {
		let response = await API.post(Apis.SiteLocations, requestData);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};

const editSiteLocations = async (siteId, requestData) => {
	try {
		let response = await API.patch(
			`${Apis.SiteLocations}/${siteId}`,
			requestData
		);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};

//#endregion

//#region delete locations
const deleteSiteLocations = async (siteId) => {
	try {
		let response = await API.delete(`${Apis.SiteLocations}/${siteId}`);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};

//#endregion

export {
	getSiteLocations,
	addSiteLocations,
	deleteSiteLocations,
	editSiteLocations,
};
