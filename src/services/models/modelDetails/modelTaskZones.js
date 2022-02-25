import API from "helpers/api";
import { Apis } from "services/api";
import { getAPIResponse } from "helpers/getApiResponse";

// get list of model task zones
const getModelTaskZonesList = async (modelVersionTaskId) => {
	try {
		let response = await API.get(
			`${Apis.ModelTaskZones}?modelVersionTaskId=${modelVersionTaskId}`
		);
		return getAPIResponse(response);
	} catch (error) {
		return getAPIResponse(error?.response);
	}
};

const addModelTaskZone = async (payload) => {
	try {
		let response = await API.post(`${Apis.ModelTaskZones}`, payload);
		return getAPIResponse(response);
	} catch (error) {
		return getAPIResponse(error?.response);
	}
};

const patchModelTaskZone = async (modelVersionTaskZoneId, payload) => {
	try {
		let response = await API.patch(
			`${Apis.ModelTaskZones}/${modelVersionTaskZoneId}`,
			payload
		);
		return getAPIResponse(response);
	} catch (error) {
		return getAPIResponse(error?.response);
	}
};

const removeModelTaskZone = async (modelVersionTaskZoneId) => {
	try {
		let response = await API.delete(
			`${Apis.ModelTaskZones}/${modelVersionTaskZoneId}`
		);
		return getAPIResponse(response);
	} catch (error) {
		return getAPIResponse(error?.response);
	}
};

const getSiteAssetsForZones = async (siteId, pNo, pSize, search = "") => {
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

export {
	getModelTaskZonesList,
	addModelTaskZone,
	patchModelTaskZone,
	removeModelTaskZone,
	getSiteAssetsForZones,
};
