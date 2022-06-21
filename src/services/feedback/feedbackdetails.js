import API from "helpers/api";
import { Apis } from "services/api";
import { getAPIResponse } from "helpers/getApiResponse";

export const getFeedbackDetails = async (id) => {
	try {
		let response = await API.get(`${Apis.Feedback}/${id}`);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};

export const getFeedbackNotes = async (id) => {
	try {
		let response = await API.get(`${Apis.FeedbackNotes}?feedbackId=${id}`);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};

export const getFeedbackImages = async (id) => {
	try {
		let response = await API.get(`${Apis.FeedbackImages}?feedbackId=${id}`);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};

export const getPositionUsers = async (id) => {
	try {
		let response = await API.get(`${Apis.positions}/${id}/users`);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};

export const addFeedbackNotes = async (payload) => {
	try {
		let response = await API.post(`${Apis.FeedbackNotes}`, payload);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};

export const uploadFeedbackImage = async (id, payload, config) => {
	try {
		let response = await API.post(
			`${Apis.Feedback}/${id}/uploadImage`,
			payload,
			config
		);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};

export const updateFeedback = async (id, payload) => {
	try {
		let response = await API.patch(`${Apis.Feedback}/${id}`, payload);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};

export const deleteDefectAudio = async (id) => {
	try {
		let response = await API.delete(`${Apis.Defects}/${id}/audio`);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};
