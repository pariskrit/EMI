import API from "helpers/api";
import { Apis } from "services/api";
import { getAPIResponse } from "helpers/getApiResponse";

const getClientDetails = async (clientId) => {
	try {
		const response = await API.get(`${Apis.Clients}/?clientId=${clientId}`);

		return getAPIResponse(response);
	} catch (error) {
		return getAPIResponse(error.response);
	}
};

export { getClientDetails };
