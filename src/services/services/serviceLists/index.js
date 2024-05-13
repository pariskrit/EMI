import API from "helpers/api";
import { Apis } from "services/api";
import { getAPIResponse } from "helpers/getApiResponse";
import { defaultPageSize } from "helpers/utils";
import { BASE_API_PATH } from "helpers/constants";

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
	pageSize = defaultPageSize(),
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
export const getModelTaskList = async ({
	siteAppId,
	pageNumber = "1",
	pageSize = defaultPageSize(),
	search = "",
	sortField = "",
	sort = "",
}) => {
	try {
		let response = await API.get(
			`${Apis.Models}?modelId=${siteAppId}&pageNumber=${pageNumber}&pageSize=${pageSize}&search=${search}&sortField=${sortField}&sort=${sort}`
		);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};
export const getCountOfModelTaskList = async ({
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
			`${Apis.Models}/count?siteAppId=${siteAppId}&fromDate=${fromDate}&toDate=${toDate}&siteDepartmentID=${siteDepartmentID}&statusType=${statusType}&status=${status}&search=${search}`
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

export const deleteNoticeboardDepartment = async (id) => {
	try {
		let response = await API.delete(`${Apis.NoticeboardDepartments}/${id}`);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};

export const getNoticeboardDepartment = async (id) => {
	try {
		let response = await API.get(
			`${Apis.NoticeboardDepartments}?noticeboardId=${id}`
		);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};

export const updateNoticeboardDepartment = async (payload) => {
	try {
		let response = await API.post(`${Apis.NoticeboardDepartments}`, payload);
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
export const DownloadCSVTemplateforModalTask = async () => {
	try {
		let response = await API.get(
			`${BASE_API_PATH}ModelVersionTasks/downloadTaskImportTemplate  `
		);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};

export const DownloadCSVTemplateForSiteSetting = async () => {
	try {
		let response = await API.get(`${Apis.SiteAssets}/downloadImportTemplate  `);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};
