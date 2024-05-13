import API from "helpers/api";
import { getAPIResponse } from "helpers/getApiResponse";
import { Apis } from "services/api";

export async function getClientDetailHistory(clientId, pageNumber, pageSize) {
	try {
		let response = await API.get(
			`${Apis.clientDetails}?pageNumber=${pageNumber}&pageSize=${pageSize}&clientId=${clientId}`
		);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
}
