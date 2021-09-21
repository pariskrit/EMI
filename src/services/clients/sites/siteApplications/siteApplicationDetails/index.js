import API from "helpers/api";
import { Apis } from "services/api";
import { getAPIResponse } from "helpers/getApiResponse";

const getSiteApplicationDetail = async (id) => {
	try {
		let response = await API.get(`${Apis.Applications}/${id}`);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};

const patchApplicationDetail = async (id, payload) => {
	try {
		let response = await API.patch(`${Apis.Applications}/${id}`, payload);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};

export { getSiteApplicationDetail, patchApplicationDetail };
