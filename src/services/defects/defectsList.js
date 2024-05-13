import API from "helpers/api";
import { Apis } from "services/api";
import { getAPIResponse } from "helpers/getApiResponse";
import { defaultPageSize } from "helpers/utils";

export const getDefectsList = async ({
	siteAppId,
	pageNumber = "1",
	pageSize = defaultPageSize(),
	search = "",
	sortField = "",
	sortOrder = "",
	fromDate = "",
	toDate = "",
	chips = [],
}) => {
	try {
		const payload = {
			siteAppId,
			pageNumber,
			pageSize,
			search,
			sortField,
			sortOrder,
			fromDate,
			toDate,
			chips,
		};
		let response = await API.post(`${Apis.DefectsSearch}`, payload);
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
	defectStatusType = "",
}) => {
	try {
		let response = await API.get(
			`${Apis.Defects}/count?siteAppId=${siteAppId}&fromDate=${fromDate}&toDate=${toDate}&siteDepartmentID=${siteDepartmentID}&defectStatusID=${defectStatusID}&defectStatusType=${defectStatusType}&search=${search}`
		);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};
export const getDefectAutocompleteSearch = async ({ search = "" }) => {
	try {
		let response = await API.get(`${Apis.DefectAutocomplete}/${search}`);
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
