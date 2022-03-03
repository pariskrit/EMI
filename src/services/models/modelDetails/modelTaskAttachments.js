import API from "helpers/api";
import { Apis } from "services/api";
import { getAPIResponse } from "helpers/getApiResponse";

const getModelTaskAttachments = async (modelVersionTaskId) => {
	try {
		let response = await API.get(
			`${Apis.ModelVersionTaskAttachments}?modelVersionTaskId=${modelVersionTaskId}`
		);
		return getAPIResponse(response);
	} catch (error) {
		return getAPIResponse(error?.response);
	}
};

const addModelTaskAttachment = async (payload) => {
	try {
		let response = await API.post(
			`${Apis.ModelVersionTaskAttachments}`,
			payload
		);
		return getAPIResponse(response);
	} catch (error) {
		return getAPIResponse(error?.response);
	}
};

const patchModelTaskAttachment = async (
	ModelVersionTaskAttachmentID,
	payload
) => {
	try {
		let response = await API.patch(
			`${Apis.ModelVersionTaskAttachments}/${ModelVersionTaskAttachmentID}`,
			payload
		);
		return getAPIResponse(response);
	} catch (error) {
		return getAPIResponse(error?.response);
	}
};
const removeModelTaskAttachment = async (ModelVersionTaskAttachmentID) => {
	try {
		let response = await API.delete(
			`${Apis.ModelVersionTaskAttachments}/${ModelVersionTaskAttachmentID}`
		);
		return getAPIResponse(response);
	} catch (error) {
		return getAPIResponse(error?.response);
	}
};

const uploadModelTaskAttachmentDocument = async (
	modelVersionTaskId,
	fileType,
	payload
) => {
	try {
		let response = await API.get(
			`${Apis.ModelVersionTaskAttachments}/uploadDocument?modelVersionTaskId=${modelVersionTaskId}&fileType=${fileType}`,
			payload
		);
		return getAPIResponse(response);
	} catch (error) {
		return getAPIResponse(error?.response);
	}
};

export {
	getModelTaskAttachments,
	addModelTaskAttachment,
	patchModelTaskAttachment,
	removeModelTaskAttachment,
	uploadModelTaskAttachmentDocument,
};
