import API from "helpers/api";
import { Apis } from "services/api";
import { getAPIResponse } from "helpers/getApiResponse";

export const getServiceDetails = async (serviceId) => {
	try {
		let response = await API.get(`${Apis.Services}/${serviceId}`);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};

export const patchServiceDetails = async (serviceId, payload) => {
	try {
		let response = await API.patch(`${Apis.Services}/${serviceId}`, payload);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};

export const changeServiceStatus = async (serviceId, payload) => {
	try {
		let response = await API.post(
			`${Apis.Services}/${serviceId}/changestatus`,
			payload
		);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};

export const resetServiceStatus = async (serviceId, payload) => {
	try {
		let response = await API.post(
			`${Apis.Services}/${serviceId}/reset`,
			payload
		);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};

export const postServiceNote = async (payload) => {
	try {
		let response = await API.post(`${Apis.ServiceNotes}`, payload);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};

export const getServiceNotes = async (serviceId) => {
	try {
		let response = await API.get(`${Apis.ServiceNotes}?serviceId=${serviceId}`);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};

export const deleteServiceNotes = async (serviceId) => {
	try {
		let response = await API.delete(`${Apis.ServiceNotes}/${serviceId}`);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};

export const getServicePeopleList = async (serviceId) => {
	try {
		let response = await API.get(`${Apis.Services}/${serviceId}/sessions`);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};
