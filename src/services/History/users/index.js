import API from "helpers/api";
import { getAPIResponse } from "helpers/getApiResponse";
import { Apis } from "services/api";

export async function SuperAdminUserDetail(userId, pageNumber, pageSize) {
	try {
		let response = await API.get(
			`${Apis.superAdminUserHistory}?pageNumber=${pageNumber}&pageSize=${pageSize}&userId=${userId}`
		);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
}
