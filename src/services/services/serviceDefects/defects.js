import API from "helpers/api";
import { Apis } from "services/api";
import { getAPIResponse } from "helpers/getApiResponse";

export const getServiceDefects = async (serviceId) => {
	try {
		let response = await API.get(`${Apis.Services}/${serviceId}/defects`);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};
