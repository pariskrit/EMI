import API from "helpers/api";
import { Apis } from "services/api";
import { getAPIResponse } from "helpers/getApiResponse";

const getFeedbackStatuses = async (id) => {
	try {
		let response = await API.get(`${Apis.FeedbackStatuses}?siteAppId=${id}`);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};

const patchFeedbackStatuses = async (id, requestData) => {
	try {
		let response = await API.patch(
			`${Apis.FeedbackStatuses}/${id}`,
			requestData
		);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};
const addFeedbackStatuses = async (requestData) => {
	try {
		let response = await API.post(Apis.FeedbackStatuses, requestData);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};

const getDefaultFeedbackStatuses = async (id) => {
	try {
		let response = await API.get(`/api/SiteApps/${id}/defaults`);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};
export {
	getFeedbackStatuses,
	addFeedbackStatuses,
	patchFeedbackStatuses,
	getDefaultFeedbackStatuses,
};
