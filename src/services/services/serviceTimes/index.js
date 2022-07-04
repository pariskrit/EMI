import API from "helpers/api";
import { Apis } from "services/api";
import { getAPIResponse } from "helpers/getApiResponse";

export const getServiceTimes = async (serviceId, stageId = "", zoneId = "") => {
	try {
		let response = await API.get(
			`${Apis.Services}/${serviceId}/servicetimes?modelVersionStageId=${stageId}&modelVersionZoneId=${zoneId}`
		);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};
