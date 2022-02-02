import API from "helpers/api";
import { Apis } from "services/api";
import { getAPIResponse } from "helpers/getApiResponse";

// get list of model zones
const getModelRolesList = async (modelVersionId) => {
	try {
		let response = await API.get(
			`${Apis.ModelRoles}?modelVersionId=${modelVersionId}`
		);
		return getAPIResponse(response);
	} catch (error) {
		return getAPIResponse(error?.response);
	}
};

const addModelRole = async (payload) => {
	try {
		let response = await API.post(`${Apis.ModelRoles}`, payload);
		return getAPIResponse(response);
	} catch (error) {
		return getAPIResponse(error?.response);
	}
};

const editModelRole = async (roleId, payload) => {
	try {
		let response = await API.patch(`${Apis.ModelRoles}/${roleId}`, payload);
		return getAPIResponse(response);
	} catch (error) {
		return getAPIResponse(error?.response);
	}
};

const getSiteAppRoles = async (siteAppId) => {
	try {
		let response = await API.get(`/api/Roles?siteAppId=${siteAppId}`);
		return getAPIResponse(response);
	} catch (error) {
		return getAPIResponse(error?.response);
	}
};

export { getModelRolesList, getSiteAppRoles, addModelRole, editModelRole };
