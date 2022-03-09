import API from "helpers/api";
import { Apis } from "services/api";
import { getAPIResponse } from "helpers/getApiResponse";

// get list of model zones
const getQuestions = async (taskId) => {
	try {
		let response = await API.get(
			`${Apis.ModelTaskQuestions}?modelVersionTaskId=${taskId}`
		);
		return getAPIResponse(response);
	} catch (error) {
		return getAPIResponse(error?.response);
	}
};

const postQuestions = async (data) => {
	try {
		let response = await API.post(`${Apis.ModelTaskQuestions}`, data);
		return getAPIResponse(response);
	} catch (error) {
		return getAPIResponse(error?.response);
	}
};

const patchQuestions = async (id, data) => {
	try {
		let response = await API.patch(`${Apis.ModelTaskQuestions}/${id}`, data);
		return getAPIResponse(response);
	} catch (error) {
		return getAPIResponse(error?.response);
	}
};

const duplicateQuestions = async (id) => {
	try {
		let response = await API.post(
			`${Apis.ModelTaskQuestions}/${id}/Duplicate`,
			{}
		);
		return getAPIResponse(response);
	} catch (error) {
		return getAPIResponse(error?.response);
	}
};

const getQuestionOptions = async (id) => {
	try {
		let response = await API.get(
			`${Apis.ModelTaskQuestionOptions}?modelVersionTaskQuestionId=${id}`
		);
		return getAPIResponse(response);
	} catch (error) {
		return getAPIResponse(error?.response);
	}
};

const postQuestionOptions = async (data) => {
	try {
		let response = await API.post(`${Apis.ModelTaskQuestionOptions}`, data);
		return getAPIResponse(response);
	} catch (error) {
		return getAPIResponse(error?.response);
	}
};

const patchQuestionOptions = async (id, data) => {
	try {
		let response = await API.patch(
			`${Apis.ModelTaskQuestionOptions}/${id}`,
			data
		);
		return getAPIResponse(response);
	} catch (error) {
		return getAPIResponse(error?.response);
	}
};

const pasteModelTaskQuestion = async (id, data) => {
	try {
		let response = await API.post(
			`${Apis.ModelTasks}/${id}/PasteQuestion`,
			data
		);
		return getAPIResponse(response);
	} catch (error) {
		return getAPIResponse(error?.response);
	}
};

export {
	getQuestions,
	postQuestions,
	patchQuestions,
	duplicateQuestions,
	getQuestionOptions,
	postQuestionOptions,
	patchQuestionOptions,
	pasteModelTaskQuestion,
};
