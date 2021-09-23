import API from "helpers/api";
import { Apis } from "services/api";
import { getAPIResponse } from "helpers/getApiResponse";

const getDefectStatuses = async (id) => {
	try {
		let response = await API.get(`${Apis.defectStatuses}?siteAppId=${id}`);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};

const addDefectStatuses = async (payload) => {
	try {
		let response = await API.post(`${Apis.defectStatuses}`, payload);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};

export { getDefectStatuses, addDefectStatuses };
