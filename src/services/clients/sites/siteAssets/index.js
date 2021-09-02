import API from "helpers/api";
import { Apis } from "services/api";
import { getAPIResponse } from "helpers/getApiResponse";

//#region get assets
const getSiteAssets = async (siteId) => {
	try {
		let response = await API.get(`${Apis.SiteAssets}?siteId=${siteId}`);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};

//#endregion

//#region add edit assets
const addSiteAsset = async (requestData) => {
	try {
		let response = await API.post(Apis.SiteAssets, requestData);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};

//#endregion

export { getSiteAssets, addSiteAsset };
