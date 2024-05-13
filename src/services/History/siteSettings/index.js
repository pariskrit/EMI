import API from "helpers/api";
import { getAPIResponse } from "helpers/getApiResponse";
import { Apis } from "services/api";

export async function getSiteSettingsHistory(siteId, pageNumber, pageSize) {
	try {
		let response = await API.get(
			`${Apis.siteSettingsHistory}?pageNumber=${pageNumber}&pageSize=${pageSize}&siteId=${siteId}`
		);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
}
export async function getSiteAssetsHistory(siteId, pageNumber, pageSize) {
	try {
		let response = await API.get(
			`${Apis.siteAssetsHistory}?pageNumber=${pageNumber}&pageSize=${pageSize}&siteId=${siteId}`
		);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
}
export async function getSiteDepartmentsHistory(siteId, pageNumber, pageSize) {
	try {
		let response = await API.get(
			`${Apis.siteDepartmentsHistory}?pageNumber=${pageNumber}&pageSize=${pageSize}&siteId=${siteId}`
		);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
}
