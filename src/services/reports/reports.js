import API from "helpers/api";
import { Apis } from "services/api";
import { getAPIResponse } from "helpers/getApiResponse";

const fileOptions = { responseType: "blob" };

export const getCompletedServiceReport = async ({ serviceId, timeZone }) => {
	try {
		let response = await API.get(
			`${Apis.Reports}/completeService?serviceId=${serviceId}&timeZone=${timeZone}`,
			fileOptions
		);

		return { ...getAPIResponse(response), headers: response.headers };
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};

export const getDefectPartsByWorkOrder = async ({ workOrder }) => {
	try {
		let response = await API.get(
			`${Apis.Reports}/partsByWorkOrder?workOrder=${workOrder}`,
			fileOptions
		);

		return { ...getAPIResponse(response), headers: response.headers };
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};

export const getDefectsSummary = async ({
	fromDate,
	toDate,
	chips,
	pageNumber,
	sortField,
	sortOrder,
	pageSize,
}) => {
	try {
		const payload = {
			fromDate,
			toDate,
			chips,
			pageNumber,
			sortField,
			sortOrder,
			pageSize,
		};

		let response = await API.post(
			`${Apis.Reports}/defectsReport`,
			payload,
			fileOptions
		);

		return { ...getAPIResponse(response), headers: response.headers };
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};

export const getDefectsByStatus = async ({
	fromDate,
	toDate,
	chips,
	pageNumber,
	sortField,
	sortOrder,
	pageSize,
}) => {
	try {
		const payload = {
			fromDate,
			toDate,
			chips,
			pageNumber,
			sortField,
			sortOrder,
			pageSize,
		};
		let response = await API.post(
			`${Apis.Reports}/defectsByStatus`,
			payload,
			fileOptions
		);

		return { ...getAPIResponse(response), headers: response.headers };
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};

export const getDefectsByRisk = async ({
	fromDate,
	toDate,
	chips,
	pageNumber,
	sortField,
	sortOrder,
	pageSize,
}) => {
	try {
		const payload = {
			fromDate,
			toDate,
			chips,
			pageNumber,
			sortField,
			sortOrder,
			pageSize,
		};
		let response = await API.post(
			`${Apis.Reports}/defectsByRisk`,
			payload,
			fileOptions
		);

		return { ...getAPIResponse(response), headers: response.headers };
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};

export const toolsSummary = async ({
	modelVersionId = "",
	modelVersionRoleId = "",
	modelVersionIntervalId = "",
	modelVersionArrangementId = "",
}) => {
	try {
		let response = await API.get(
			`${Apis.Reports}/toolsSummary?modelVersionID=${modelVersionId}&modelVersionRoleID=${modelVersionRoleId}&modelVersionIntervalID=${modelVersionIntervalId}&modelVersionArrangementID=${modelVersionArrangementId}`,
			fileOptions
		);

		return { ...getAPIResponse(response), headers: response.headers };
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};

export const partsSummary = async ({
	modelVersionId = "",
	modelVersionRoleId = "",
	modelVersionIntervalId = "",
	modelVersionArrangementId = "",
}) => {
	try {
		let response = await API.get(
			`${Apis.Reports}/partsSummary?modelVersionID=${modelVersionId}&modelVersionRoleID=${modelVersionRoleId}&modelVersionIntervalID=${modelVersionIntervalId}&modelVersionArrangementID=${modelVersionArrangementId}`,
			fileOptions
		);

		return { ...getAPIResponse(response), headers: response.headers };
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};

export const partsByTask = async ({
	modelVersionId = "",
	modelVersionRoleId = "",
	modelVersionIntervalId = "",
	modelVersionArrangementId = "",
}) => {
	try {
		let response = await API.get(
			`${Apis.Reports}/partsByTask?modelVersionID=${modelVersionId}&modelVersionRoleID=${modelVersionRoleId}&modelVersionIntervalID=${modelVersionIntervalId}&modelVersionArrangementID=${modelVersionArrangementId}`,
			fileOptions
		);

		return { ...getAPIResponse(response), headers: response.headers };
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};

export const toolsByTask = async ({
	modelVersionId = "",
	modelVersionRoleId = "",
	modelVersionIntervalId = "",
	modelVersionArrangementId = "",
}) => {
	try {
		let response = await API.get(
			`${Apis.Reports}/toolsByTask?modelVersionID=${modelVersionId}&modelVersionRoleID=${modelVersionRoleId}&modelVersionIntervalID=${modelVersionIntervalId}&modelVersionArrangementID=${modelVersionArrangementId}`,
			fileOptions
		);

		return { ...getAPIResponse(response), headers: response.headers };
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};

export const serviceSheet = async ({
	modelVersionId = "",
	modelVersionRoleId = "",
	modelVersionIntervalId = "",
	modelVersionArrangementId = "",
}) => {
	try {
		let response = await API.get(
			`${Apis.Reports}/serviceSheet?modelVersionID=${modelVersionId}&modelVersionRoleID=${modelVersionRoleId}&modelVersionIntervalID=${modelVersionIntervalId}&modelVersionArrangementID=${modelVersionArrangementId}`,
			fileOptions
		);

		return { ...getAPIResponse(response), headers: response.headers };
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};

export const getModelTasksExcel = async ({ modelVersionId = "" }) => {
	try {
		let response = await API.get(
			`${Apis.Reports}/modeltaskexcel?modelVersionID=${modelVersionId}`,
			fileOptions
		);

		return { ...getAPIResponse(response), headers: response.headers };
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};

export const getTasksWhereAssetUsed = async ({ siteAssetId }) => {
	try {
		let response = await API.get(
			`${Apis.Reports}/tasksWhereAssetUsed?siteAssetId=${siteAssetId}`,
			fileOptions
		);

		return { ...getAPIResponse(response), headers: response.headers };
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};

export const getServiceListReport = async ({
	searchFilter,
	statusType,
	statusId,
	department,
	fromDate,
	toDate,
	timeZone,
}) => {
	try {
		let response = await API.get(
			`${Apis.Reports}/serviceList?searchFilter=${searchFilter}&statusType=${statusType}&status=${statusId}&siteDepartmentID=${department}&fromDate=${fromDate}&toDate=${toDate}&timeZone=${timeZone}`,
			fileOptions
		);
		return { ...getAPIResponse(response), headers: response.headers };
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};
