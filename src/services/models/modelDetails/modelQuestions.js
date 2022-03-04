import API from "helpers/api";
import { Apis } from "services/api";
import { getAPIResponse } from "helpers/getApiResponse";

const getModelQuestions = async (id) => {
	try {
		let response = await API.get(`${Apis.ModelQuestions}?modelVersionId=${id}`);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};

const postModelQuestions = async (data) => {
	try {
		let response = await API.post(`${Apis.ModelQuestions}`, data);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};

const patchModelQuestions = async (id, data) => {
	try {
		let response = await API.patch(`${Apis.ModelQuestions}/${id}`, data);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};

const duplicateModelQuestions = async (id) => {
	try {
		let response = await API.post(`${Apis.ModelQuestions}/${id}/duplicate`, {});
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};

const pasteModelQuestions = async (id, data) => {
	try {
		let response = await API.post(
			`${Apis.ModelVersions}/${id}/pasteQuestion`,
			data
		);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};

const postModelQuestionRole = async (data) => {
	try {
		let response = await API.post(`${Apis.ModelQuestionRole}`, data);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};

const deleteModelQuestionRole = async (id) => {
	try {
		let response = await API.delete(`${Apis.ModelQuestionRole}/${id}`);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};

const postModelQuestionOption = async (data) => {
	try {
		let response = await API.post(`${Apis.ModelQuestionOption}`, data);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};

const patchModelQuestionOption = async (id, data) => {
	try {
		let response = await API.patch(`${Apis.ModelQuestionOption}/${id}`, data);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};

const deleteModelQuestionOption = async (id) => {
	try {
		let response = await API.delete(`${Apis.ModelQuestionOption}/${id}`);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};

export {
	getModelQuestions,
	postModelQuestions,
	patchModelQuestions,
	duplicateModelQuestions,
	pasteModelQuestions,
	postModelQuestionRole,
	deleteModelQuestionRole,
	postModelQuestionOption,
	patchModelQuestionOption,
	deleteModelQuestionOption,
};
