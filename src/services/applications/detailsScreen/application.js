import API from "helpers/api";
import { Apis } from "services/api";
import { getAPIResponse } from "helpers/getApiResponse";

export const updateApplicaitonDetails = async (applicationId, payload) => {
	try {
		const response = await API.patch(
			`${Apis.Application}/${applicationId}`,
			payload
		);
		return getAPIResponse(response);
	} catch (error) {
		return getAPIResponse(error.response);
	}
};

export const uploadWaterMark = async (applicationId, payload, config = {}) => {
	try {
		const response = await API.post(
			`${Apis.Application}/${applicationId}/uploadWaterMark`,
			payload,
			config
		);
		return getAPIResponse(response);
	} catch (error) {
		return getAPIResponse(error.response);
	}
};

export const uploadMobileWhiteAppLogo = async (
	applicationId,
	payload,
	config = {}
) => {
	try {
		const response = await API.post(
			`${Apis.Application}/${applicationId}/uploadMobileWhiteAppLogo`,
			payload,
			config
		);
		return getAPIResponse(response);
	} catch (error) {
		return getAPIResponse(error.response);
	}
};

export const uploadMobileWhiteSmallAppLogo = async (
	applicationId,
	payload,
	config = {}
) => {
	try {
		const response = await API.post(
			`${Apis.Application}/${applicationId}/uploadMobileWhiteSmallAppLogo`,
			payload,
			config
		);
		return getAPIResponse(response);
	} catch (error) {
		return getAPIResponse(error.response);
	}
};

export const uploadSmallAppLogo = async (
	applicationId,
	payload,
	config = {}
) => {
	try {
		const response = await API.post(
			`${Apis.Application}/${applicationId}/uploadSmallAppLogo`,
			payload,
			config
		);
		return getAPIResponse(response);
	} catch (error) {
		return getAPIResponse(error.response);
	}
};

export const uploadAppLogo = async (applicationId, payload, config = {}) => {
	try {
		const response = await API.post(
			`${Apis.Application}/${applicationId}/uploadAppLogo`,
			payload,
			config
		);
		return getAPIResponse(response);
	} catch (error) {
		return getAPIResponse(error.response);
	}
};
