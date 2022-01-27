import API from "helpers/api";
import { Apis } from "services/api";
import { getAPIResponse } from "helpers/getApiResponse";

// get list of model zones
const getModelZonesList = async (modelVersionId) => {
	try {
		let response = await API.get(
			`${Apis.ModelZones}?modelVersionId=${modelVersionId}`
		);
		return getAPIResponse(response);
	} catch (error) {
		return getAPIResponse(error?.response);
	}
};

const addNewModelZone = async (payload) => {
	try {
		let response = await API.post(`${Apis.ModelZones}`, payload);
		return getAPIResponse(response);
	} catch (error) {
		return getAPIResponse(error?.response);
	}
};

const uploadZoneImage = async (zoneId, payload) => {
	try {
		let response = await API.post(
			`${Apis.ModelZones}/${zoneId}/uploadImage`,
			payload
		);
		return getAPIResponse(response);
	} catch (error) {
		return getAPIResponse(error?.response);
	}
};

const patchModelVersionZones = async (modelVersionZoneId, payload) => {
	try {
		let response = await API.patch(
			`${Apis.ModelZones}/${modelVersionZoneId}`,
			payload
		);
		return getAPIResponse(response);
	} catch (error) {
		return getAPIResponse(error?.response);
	}
};

const EditableModelVersionCheck = async (modelVersionZoneId) => {
	try {
		let response = await API.get(`/api/ModelVersions/${modelVersionZoneId}`);
		return getAPIResponse(response);
	} catch (error) {
		return getAPIResponse(error?.response);
	}
};

export {
	getModelZonesList,
	patchModelVersionZones,
	addNewModelZone,
	uploadZoneImage,
	EditableModelVersionCheck,
};
