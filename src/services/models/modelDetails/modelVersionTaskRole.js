import API from "helpers/api";
import { Apis } from "services/api";
import { getAPIResponse } from "helpers/getApiResponse";

//post model version task roles
const addModelVersionTaskRoles = async (payload) => {
	try {
		let response = await API.post(`${Apis.ModelVersionTaskRoles}`, payload);
		return getAPIResponse(response);
	} catch (error) {
		return getAPIResponse(error?.response);
	}
};

const removeModelVersionTaskRole = async (taskRoleId) => {
	try {
		let response = await API.delete(
			`${Apis.ModelVersionTaskRoles}/${taskRoleId}`
		);
		return getAPIResponse(response);
	} catch (error) {
		return getAPIResponse(error?.response);
	}
};

export { addModelVersionTaskRoles, removeModelVersionTaskRole };
