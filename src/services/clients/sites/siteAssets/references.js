import API from "helpers/api";
import { Apis } from "services/api";
import { getAPIResponse } from "helpers/getApiResponse";

const getSiteAssetReferences = async (siteId) => {
	try {
		let response = await API.get(
			`${Apis.SiteReferences}?siteAssetId=${siteId}`
		);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};

const postSiteAssetReferences = async (data) => {
	try {
		let response = await API.post(`${Apis.SiteReferences}`, data);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};

const deleteSiteAssetReferences = async (id) => {
	try {
		let response = await API.delete(`${Apis.SiteReferences}/${id}`);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};

const updateSiteAssetReferences = async (id, data) => {
	try {
		let response = await API.patch(`${Apis.SiteReferences}/${id}`, data);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};

export {
	getSiteAssetReferences,
	postSiteAssetReferences,
	deleteSiteAssetReferences,
	updateSiteAssetReferences,
};
