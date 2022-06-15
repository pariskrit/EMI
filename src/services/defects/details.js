import API from "helpers/api";
import { Apis } from "services/api";
import { getAPIResponse } from "helpers/getApiResponse";

export const getDefectDetail = async (id) => {
	try {
		let response = await API.get(`${Apis.Defects}/${id}`);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};

export const getDefectNotes = async (id) => {
	try {
		let response = await API.get(`${Apis.DefectNotes}?defectId=${id}`);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};

export const getDefectImages = async (id) => {
	try {
		let response = await API.get(`${Apis.DefectImages}?defectId=${id}`);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};

export const addDefectNotes = async (payload) => {
	try {
		let response = await API.post(`${Apis.DefectNotes}`, payload);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};

export const uploadDefectImage = async (id, payload, config) => {
	try {
		let response = await API.post(
			`${Apis.Defects}/${id}/uploadImage`,
			payload,
			config
		);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};

export const updateDefect = async (id, payload) => {
	try {
		let response = await API.patch(`${Apis.Defects}/${id}`, payload);
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
