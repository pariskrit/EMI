import API from "helpers/api";
import { Apis } from "services/api";
import { getAPIResponse } from "helpers/getApiResponse";

//#region get Feedback Priorities
const getFeedbackPriorities = async (id) => {
	try {
		let response = await API.get(`${Apis.FeedbackPriorities}?siteAppId=${id}`);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};

//#endregion

//#region patch Feedback Priorities
const patchFeedbackPriorities = async (id, requestData) => {
	try {
		let response = await API.patch(
			`${Apis.FeedbackPriorities}/${id}`,
			requestData
		);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};

//#endregion

//#region patch Feedback Priorities
const addFeedbackPriorities = async (requestData) => {
	try {
		let response = await API.post(Apis.FeedbackPriorities, requestData);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};

//#endregion

const patchDefaultFeedbackPriorities = async (id, requestData) => {
	try {
		let response = await API.patch(`/api/siteapps/${id}`, requestData);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};

//#endregion

//#endregion

const getDefaultFeedbackPriorities = async (id) => {
	try {
		let response = await API.get(`/api/SiteApps/${id}/defaults`);
		console.log(response);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};

//#endregion

export {
	getFeedbackPriorities,
	patchFeedbackPriorities,
	addFeedbackPriorities,
	patchDefaultFeedbackPriorities,
	getDefaultFeedbackPriorities,
};
