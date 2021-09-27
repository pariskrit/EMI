import API from "helpers/api";
import { Apis } from "services/api";
import { getAPIResponse } from "helpers/getApiResponse";

//#region get Feedback Classifications
const getFeedbackClassifications = async (id) => {
	try {
		let response = await API.get(
			`${Apis.FeedbackClassifications}?siteAppId=${id}`
		);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};

//#endregion

//#region patch Feedback Classifications
const patchFeedbackClassifications = async (id, requestData) => {
	try {
		let response = await API.patch(
			`${Apis.FeedbackClassifications}/${id}`,
			requestData
		);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};

//#endregion

//#region patch Feedback Classifications
const addFeedbackClassifications = async (requestData) => {
	try {
		let response = await API.post(Apis.FeedbackClassifications, requestData);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};

//#endregion

const patchDefaultFeedbackClassifications = async (id, requestData) => {
	try {
		let response = await API.patch(`/api/SiteApps/${id}`, requestData);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};

//#endregion

//#endregion

const getDefaultFeedbackClassifications = async (id) => {
	try {
		let response = await API.get(`/api/SiteApps/${id}/defaults`);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};

//#endregion

export {
	getFeedbackClassifications,
	patchFeedbackClassifications,
	addFeedbackClassifications,
	patchDefaultFeedbackClassifications,
	getDefaultFeedbackClassifications,
};
