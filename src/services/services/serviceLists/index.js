import API from "helpers/api";
import { Apis } from "services/api";
import { getAPIResponse } from "helpers/getApiResponse";
import { DefaultPageSize } from "helpers/constants";

export const postNewService = async (payload) => {
	try {
		let response = await API.post(`${Apis.Services}`, payload);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};

export const getServicesList = async ({
	siteAppId,
	pageNumber = "1",
	pageSize = DefaultPageSize,
	search = "",
	sortField = "",
	sort = "",
	fromDate = "",
	toDate = "",
	siteDepartmentID = "",
	statusType = "",
	status = "",
}) => {
	try {
		let response = await API.get(
			`${Apis.Services}?siteAppId=${siteAppId}&fromDate=${fromDate}&toDate=${toDate}&siteDepartmentID=${siteDepartmentID}&statusType=${statusType}&status=${status}&pageNumber=${pageNumber}&pageSize=${pageSize}&search=${search}&sortField=${sortField}&sort=${sort}`
		);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};

export const getCountOfServiceList = async ({
	siteAppId,
	search = "",
	fromDate = "",
	toDate = "",
	siteDepartmentID = "",
	statusType = "",
	status = "",
}) => {
	try {
		let response = await API.get(
			`${Apis.Services}/count?siteAppId=${siteAppId}&fromDate=${fromDate}&toDate=${toDate}&siteDepartmentID=${siteDepartmentID}&statusType=${statusType}&status=${status}&search=${search}`
		);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};

export const importService = async (payload) => {
	try {
		let response = await API.post(`${Apis.Services}/import`, payload);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};

export const getSiteDepartmentsInService = async (id) => {
	try {
		let response = await API.get(`${Apis.SiteDepartments}?siteId=${id}`);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};

export const DownloadCSVTemplate = async () => {
	try {
		let response = await API.get(`${Apis.Services}/downloadImportTemplate `);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};
