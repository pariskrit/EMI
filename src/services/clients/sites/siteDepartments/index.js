import API from "helpers/api";
import { Apis } from "services/api";
import { getAPIResponse } from "helpers/getApiResponse";

//#region get departments
const getSiteDepartments = async (siteId) => {
	try {
		let response = await API.get(`${Apis.SiteDepartments}?siteId=${siteId}`);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};

//#endregion

//#region add edit departments
const addSiteDepartments = async (requestData) => {
	try {
		let response = await API.post(Apis.SiteDepartments, requestData);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};

const editSiteDepartments = async (siteId, requestData) => {
	try {
		let response = await API.patch(
			`${Apis.SiteDepartments}/${siteId}`,
			requestData
		);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};

//#endregion

//#region delete departments
const deleteSiteDepartments = async (siteId) => {
	try {
		let response = await API.delete(`${Apis.SiteDepartments}/${siteId}`);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};

//#endregion

export {
	getSiteDepartments,
	addSiteDepartments,
	deleteSiteDepartments,
	editSiteDepartments,
};
