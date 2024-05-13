import API from "helpers/api";
import { Apis } from "services/api";
import { getAPIResponse } from "helpers/getApiResponse";

// get list of model zones
export const getServiceLayoutData = async (id) => {
	try {
		let response = await API.get(`${Apis.ModelVersions}/${id}/servicelayout`);
		return getAPIResponse(response);
	} catch (error) {
		return getAPIResponse(error?.response);
	}
};

export const getServiceLayoutDataByRole = async (id, roleId) => {
	try {
		let response = await API.get(
			`${Apis.ModelVersions}/${id}/servicelayout?modelversionroleid=${roleId}`
		);
		return getAPIResponse(response);
	} catch (error) {
		return getAPIResponse(error?.response);
	}
};

export const getServiceLayoutDataByInterval = async (id, intervalId) => {
	try {
		let response = await API.get(
			`${Apis.ModelVersions}/${id}/servicelayout?modelversionintervalid=${intervalId}`
		);
		return getAPIResponse(response);
	} catch (error) {
		return getAPIResponse(error?.response);
	}
};

export const getServiceLayoutDataByRoleAndInterval = async (
	id,
	intervalId,
	roleId,
	arrangementId
) => {
	try {
		let response = await API.get(
			`${Apis.ModelVersions}/${id}/servicelayout?modelversionroleid=${roleId}&modelversionintervalid=${intervalId}&modelversionarrangementid=${arrangementId}`
		);
		return getAPIResponse(response);
	} catch (error) {
		return getAPIResponse(error?.response);
	}
};

export const getModelIntervals = async (id) => {
	try {
		let response = await API.get(`${Apis.ModelIntervals}?modelVersionId=${id}`);
		return getAPIResponse(response);
	} catch (error) {
		return getAPIResponse(error?.response);
	}
};

export const patchQuestions = async (id, payload) => {
	try {
		let response = await API.patch(`${Apis.ModelQuestions}/${id}`, payload);
		return getAPIResponse(response);
	} catch (error) {
		return getAPIResponse(error?.response);
	}
};

export const patchTaskStages = async (id, payload) => {
	try {
		let response = await API.patch(`${Apis.ModelTaskStages}/${id}`, payload);
		return getAPIResponse(response);
	} catch (error) {
		return getAPIResponse(error?.response);
	}
};

export const patchTaskZones = async (id, payload) => {
	try {
		let response = await API.patch(`${Apis.ModelTaskZones}/${id}`, payload);
		return getAPIResponse(response);
	} catch (error) {
		return getAPIResponse(error?.response);
	}
};

export const patchTaskQuestions = async (id, payload) => {
	try {
		let response = await API.patch(`${Apis.ModelTaskQuestions}/${id}`, payload);
		return getAPIResponse(response);
	} catch (error) {
		return getAPIResponse(error?.response);
	}
};
