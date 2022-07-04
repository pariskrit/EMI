import API from "helpers/api";
import { Apis } from "services/api";
import { getAPIResponse } from "helpers/getApiResponse";

export const getConditionMonitorQuestion = async (serviceId) => {
	try {
		let response = await API.get(
			`${Apis.Services}/${serviceId}/conditionMonitoringQuestions`
		);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};

export const getConditionMonitorGraphDetail = async (
	serviceId,
	serviceTaskQuestionId
) => {
	try {
		let response = await API.get(
			`${Apis.Services}/${serviceId}/cmdata/${serviceTaskQuestionId}`
		);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};
