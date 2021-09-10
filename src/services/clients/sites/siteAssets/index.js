import API from "helpers/api";
import { Apis } from "services/api";
import { getAPIResponse } from "helpers/getApiResponse";

// Import from list
const importSiteAssets = async (siteId, data) => {
	try {
		let response = await API.post(`${Apis.SiteAssets}/${siteId}/import`, data);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};

//#region get assets
const getSiteAssets = async (siteId, pNo, search = "") => {
	try {
		let pageSearchField =
			pNo !== null ? `&&pageNumber=${pNo}&&pageSize=12` : "";
		let response = await API.get(
			`${Apis.SiteAssets}?siteId=${siteId}${pageSearchField}&&search=${search}`
		);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};

const getSiteAssetsCount = async (siteId) => {
	try {
		let response = await API.get(`${Apis.SiteAssetsCount}?siteId=${siteId}`);
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

const editSiteAsset = async (id, data) => {
	try {
		let response = await API.patch(`${Apis.SiteAssets}/${id}`, data);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};

//#endregion

export {
	importSiteAssets,
	getSiteAssets,
	getSiteAssetsCount,
	addSiteAsset,
	editSiteAsset,
};
