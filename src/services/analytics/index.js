import API from "helpers/api";
import { Apis } from "services/api";
import { getAPIResponse } from "helpers/getApiResponse";

const getDefectRiskRatings = async () => {
	try {
		let response = await API.get(`${Apis.DefectRiskRatings}`);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};

const getDefectTypes = async () => {
	try {
		let response = await API.get(`${Apis.DefectTypes}`);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};

const getSiteDepartments = async (siteAppId) => {
	try {
		let response = await API.get(
			`${Apis.SiteDepartments}?siteAppId=${siteAppId}`
		);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};
const getModelsPublished = async ({ siteDepartmentId = "" }) => {
	try {
		let response = await API.get(
			`${Apis.ModelsPublished}?siteDepartmentId=${siteDepartmentId}`
		);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};

const getDefectsByType = async ({
	defectTypeId = "",
	startDate = "",
	endDate = "",
	defectRiskRatingId = "",
	siteDepartmentId = "",
	modelId = "",
}) => {
	try {
		let response = await API.get(
			`${Apis.Analytics}/defectsByType?defectTypeId=${defectTypeId}&startDate=${startDate}&endDate=${endDate}&defectRiskRatingId=${defectRiskRatingId}&siteDepartmentId=${siteDepartmentId}&modelId=${modelId}`
		);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};

const getDefectsByRiskRating = async ({
	defectRiskRatingId = "",
	startDate = "",
	endDate = "",
	siteDepartmentId = "",
	modelId = "",
}) => {
	try {
		let response = await API.get(
			`${Apis.Analytics}/defectsByRiskRating?defectRiskRatingId=${defectRiskRatingId}&startDate=${startDate}&endDate=${endDate}&siteDepartmentId=${siteDepartmentId}&modelId=${modelId}`
		);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};

const getDefectsBySystem = async ({
	defectSystemId = "",
	defectRiskRatingId = "",
	startDate = "",
	endDate = "",
	siteDepartmentId = "",
	modelId = "",
}) => {
	try {
		let response = await API.get(
			`${Apis.Analytics}/defectsBySystem?defectSystemId=${defectSystemId}&defectRiskRatingId=${defectRiskRatingId}&startDate=${startDate}&endDate=${endDate}&siteDepartmentId=${siteDepartmentId}&modelId=${modelId}`
		);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};

const getDefectsRegistered = async ({
	defectTypeId = "",
	defectRiskRatingId = "",
	startDate = "",
	endDate = "",
	siteDepartmentId = "",
	modelId = "",
	defectStatusType = "",
	notificationRaised = "",
}) => {
	try {
		let response = await API.get(
			`${Apis.Analytics}/defectsRegistered?defectTypeId=${defectTypeId}&defectRiskRatingId=${defectRiskRatingId}&startDate=${startDate}&endDate=${endDate}&siteDepartmentId=${siteDepartmentId}&modelId=${modelId}&defectStatusType=${defectStatusType}&notificationRaised=${notificationRaised}`
		);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};

const getMissingPartsTools = async ({
	missingPartToolId = "",
	startDate = "",
	endDate = "",
	siteDepartmentId = "",
	modelId = "",
}) => {
	try {
		let response = await API.get(
			`${Apis.Analytics}/missingPartsTools?missingPartToolId=${missingPartToolId}&startDate=${startDate}&endDate=${endDate}&siteDepartmentId=${siteDepartmentId}&modelId=${modelId}`
		);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};

const getOverdueServices = async ({
	roleId = "",
	startDate = "",
	endDate = "",
	siteDepartmentId = "",
	modelId = "",
}) => {
	try {
		let response = await API.get(
			`${Apis.Analytics}/overdueServices?roleId=${roleId}&startDate=${startDate}&endDate=${endDate}&siteDepartmentId=${siteDepartmentId}&modelId=${modelId}`
		);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};

const getPlannedWorkCompliance = async ({
	status = "",
	roleId = "",
	startDate = "",
	endDate = "",
	siteDepartmentId = "",
	modelId = "",
}) => {
	try {
		let response = await API.get(
			`${Apis.Analytics}/plannedWorkCompliance?status=${status}&roleId=${roleId}&startDate=${startDate}&endDate=${endDate}&siteDepartmentId=${siteDepartmentId}&modelId=${modelId}`
		);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};

const getPausesByReason = async ({
	pauseId = "",
	startDate = "",
	endDate = "",
	siteDepartmentId = "",
	modelId = "",
}) => {
	try {
		let response = await API.get(
			`${Apis.Analytics}/pausesByReason?pauseId=${pauseId}&startDate=${startDate}&endDate=${endDate}&siteDepartmentId=${siteDepartmentId}&modelId=${modelId}`
		);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};

const getSkippedTasksByReason = async ({
	skipReasonId = "",
	startDate = "",
	endDate = "",
	siteDepartmentId = "",
	modelId = "",
}) => {
	try {
		let response = await API.get(
			`${Apis.Analytics}/skippedTasksByReason?skipReasonId=${skipReasonId}&startDate=${startDate}&endDate=${endDate}&siteDepartmentId=${siteDepartmentId}&modelId=${modelId}`
		);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};

const getStopsByReason = async ({
	stopReasonId = "",
	startDate = "",
	endDate = "",
	siteDepartmentId = "",
	modelId = "",
}) => {
	try {
		let response = await API.get(
			`${Apis.Analytics}/stopsByReason?stopReasonId=${stopReasonId}&startDate=${startDate}&endDate=${endDate}&siteDepartmentId=${siteDepartmentId}&modelId=${modelId}`
		);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};

const getServiceStatusChangesByReason = async ({
	changeStatusReasonId = "",
	startDate = "",
	endDate = "",
	siteDepartmentId = "",
	modelId = "",
}) => {
	try {
		let response = await API.get(
			`${Apis.Analytics}/serviceStatusChangesByReason?changeStatusReasonId=${changeStatusReasonId}&startDate=${startDate}&endDate=${endDate}&siteDepartmentId=${siteDepartmentId}&modelId=${modelId}`
		);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};

const getModelAssetsAvailable = async ({ modelId = "" }) => {
	try {
		let response = await API.get(
			`${Apis.ModelAssets}/available?modelId=${modelId}`
		);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};

const getModelVersionRoles = async ({ modelVersionId = "" }) => {
	try {
		let response = await API.get(
			`${Apis.ModelRoles}?modelVersionId=${modelVersionId}`
		);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};

const getModelVersionIntervals = async ({ modelVersionId = "" }) => {
	try {
		let response = await API.get(
			`${Apis.ModelIntervals}?modelVersionId=${modelVersionId}`
		);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};

const getConditionMonitoringQuestions = async ({
	modelVersionId = "",
	modelVersionRoleId = "",
	modelVersionIntervalId = "",
}) => {
	try {
		let response = await API.get(
			`${Apis.Analytics}/conditionmonitoringquestions?modelVersionId=${modelVersionId}&modelVersionRoleId=${modelVersionRoleId}&modelVersionIntervalId=${modelVersionIntervalId}`
		);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};

const getConditionMonitoring = async ({
	modelVersionTaskQuestionId = "",
	siteAssetId = "",
	modelVersionStageId = "",
	modelVersionZoneId = "",
	startDate = "",
	endDate = "",
}) => {
	try {
		let response = await API.get(
			`${Apis.Analytics}/conditionmonitoring?modelVersionTaskQuestionId=${modelVersionTaskQuestionId}&siteAssetId=${siteAssetId}&modelVersionStageId=${modelVersionStageId}&modelVersionZoneId=${modelVersionZoneId}&startDate=${startDate}&endDate=${endDate}`
		);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};

const getCompletedVsOutstanding = async ({
	defectTypeId = "",
	startDate = "",
	endDate = "",
	defectRiskRatingId = "",
	siteDepartmentId = "",
	modelId = "",
	defectStatusType = "",
}) => {
	try {
		let response = await API.get(
			`${Apis.Analytics}/completedvsoutstanding?defectTypeId=${defectTypeId}&startDate=${startDate}&endDate=${endDate}&defectRiskRatingId=${defectRiskRatingId}&siteDepartmentId=${siteDepartmentId}&modelId=${modelId}&defectStatusType=${defectStatusType}`
		);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};

const getAverageTimes = async ({
	modelVersionId = "",
	siteAssetId = "",
	modelVersionRoleId = "",
	modelVersionIntervalId = "",
	modelVersionStageId = "",
	modelVersionZoneId = "",
	startDate = "",
	endDate = "",
}) => {
	try {
		let response = await API.get(
			`${
				Apis.Analytics
			}/averagetimes?modelVersionId=${modelVersionId}&siteAssetId=${siteAssetId}&startDate=${startDate}&endDate=${endDate}${
				modelVersionRoleId && `&modelVersionRoleId=${modelVersionRoleId}`
			}&modelVersionIntervalId=${modelVersionIntervalId}&modelVersionStageId=${modelVersionStageId}&modelVersionZoneId=${modelVersionZoneId}`
		);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};

export {
	getDefectRiskRatings,
	getDefectTypes,
	getSiteDepartments,
	getModelsPublished,
	getDefectsByType,
	getDefectsByRiskRating,
	getDefectsBySystem,
	getDefectsRegistered,
	getMissingPartsTools,
	getOverdueServices,
	getPlannedWorkCompliance,
	getPausesByReason,
	getSkippedTasksByReason,
	getStopsByReason,
	getServiceStatusChangesByReason,
	getModelAssetsAvailable,
	getModelVersionRoles,
	getModelVersionIntervals,
	getConditionMonitoringQuestions,
	getConditionMonitoring,
	getCompletedVsOutstanding,
	getAverageTimes,
};
