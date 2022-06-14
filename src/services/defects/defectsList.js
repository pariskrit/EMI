import API from "helpers/api";
import { Apis } from "services/api";
import { getAPIResponse } from "helpers/getApiResponse";
import { DefaultPageSize } from "helpers/constants";

export const getDefectsList = async ({
	siteAppId,
	pageNumber = "1",
	pageSize = DefaultPageSize,
	search = "",
	sortField = "",
	sortOrder = "",
	fromDate = "",
	toDate = "",
	siteDepartmentID = "",
	defectStatusID = "",
}) => {
	try {
		let response = await API.get(
			`${Apis.Defects}?siteAppId=${siteAppId}&fromDate=${fromDate}&toDate=${toDate}&siteDepartmentID=${siteDepartmentID}&defectStatusID=${defectStatusID}&pageNumber=${pageNumber}&pageSize=${pageSize}&search=${search}&sortField=${sortField}&sortOrder=${sortOrder}`
		);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};

export const getCountOfDefectsList = async ({
	siteAppId,
	search = "",
	fromDate = "",
	toDate = "",
	siteDepartmentID = "",
	defectStatusID = "",
}) => {
	try {
		let response = await API.get(
			`${Apis.Defects}/count?siteAppId=${siteAppId}&fromDate=${fromDate}&toDate=${toDate}&siteDepartmentID=${siteDepartmentID}&defectStatusID=${defectStatusID}&search=${search}`
		);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};

export const postNewDefect = async (payload) => {
	try {
		let response = await API.post(`${Apis.Defects}`, payload);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};
