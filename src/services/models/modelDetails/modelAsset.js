import API from "helpers/api";
import { Apis } from "services/api";
import { getAPIResponse } from "helpers/getApiResponse";

// get list of model zones
const getModelAsset = async (modelId) => {
	try {
		let response = await API.get(`${Apis.ModelAssets}?modelId=${modelId}`);
		return getAPIResponse(response);
	} catch (error) {
		return getAPIResponse(error?.response);
	}
};


const getModelAvailableAsset = async (modelId) => {
	try {
		let response = await API.get(
			`${Apis.ModelAssets}/available?modelId=${modelId}`
		);
		return getAPIResponse(response);
	} catch (error) {
		return getAPIResponse(error?.response);
	}
};

const postModelAsset = async (data) => {
	try {
		let response = await API.post(`${Apis.ModelAssets}`, data);
		return getAPIResponse(response);
	} catch (error) {
		return getAPIResponse(error?.response);
	}
};

const getSearchedSiteAssets = async (siteId, pNo, pSize, search = "") => {
	try {
		let pageSearchField =
			pNo !== null ? `&&pageNumber=${pNo}&&pageSize=${pSize}` : "";
		let response = await API.get(
			`${Apis.SiteAssets}?siteAppId=${siteId}${pageSearchField}&&search=${search}`
		);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};

const patchmodelAssest = async (id, payload) => {
	try {
		let response = await API.patch(`${Apis.ModelAssets}/${id}`, payload);
		return getAPIResponse(response);
	} catch (error) {
		return getAPIResponse(error?.response);
	}
};

export {
	getModelAsset,
	postModelAsset,
	getSearchedSiteAssets,
	patchmodelAssest,
	getModelAvailableAsset,
};
