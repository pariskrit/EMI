import API from "helpers/api";
import { Apis } from "services/api";
import { getAPIResponse } from "helpers/getApiResponse";
import { defaultPageSize } from "helpers/utils";

export const getFeedbackList = async ({
	siteAppId,
	pageNumber = "1",
	pageSize = defaultPageSize(),
	search = "",
	sortField = "",
	sortOrder = "",
	fromDate = "",
	toDate = "",
	siteDepartmentID = "",
	statusType = "",
	feedbackStatusID = "",
	myFeedback = true,
}) => {
	try {
		let response = await API.get(
			`${Apis.Feedback}?siteAppId=${siteAppId}&fromDate=${fromDate}&toDate=${toDate}&siteDepartmentID=${siteDepartmentID}&feedbackStatusID=${feedbackStatusID}&statusType=${statusType}&myFeedback=${myFeedback}&pageNumber=${pageNumber}&pageSize=${pageSize}&search=${search}&sortField=${sortField}&sortOrder=${sortOrder}`
		);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};

export const getCountOfFeedbackList = async ({
	siteAppId,
	search = "",
	fromDate = "",
	toDate = "",
	siteDepartmentID = "",
	myFeedback = true,
	feedbackStatusID = "",
	statusType = "",
}) => {
	try {
		let response = await API.get(
			`${Apis.Feedback}/count?siteAppId=${siteAppId}&fromDate=${fromDate}&toDate=${toDate}&siteDepartmentID=${siteDepartmentID}&feedbackStatusID=${feedbackStatusID}&search=${search}&statusType=${statusType}&myFeedback=${myFeedback}`
		);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};

export const postNewFeedback = async (payload) => {
	try {
		let response = await API.post(`${Apis.Feedback}`, payload);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};
