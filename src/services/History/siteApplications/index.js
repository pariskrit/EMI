import API from "helpers/api";
import { getAPIResponse } from "helpers/getApiResponse";
import { Apis } from "services/api";

export async function getSiteApplicationDetailsHistory(
	siteAppID,
	siteId,
	pageNumber,
	pageSize
) {
	try {
		let response = await API.get(
			`${Apis.siteAppDetails}?pageNumber=${pageNumber}&pageSize=${pageSize}&siteAppID=${siteAppID}&siteId=${siteId}`
		);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
}
export async function getSiteApplicationPauseReasonHistory(
	siteAppID,
	pageNumber,
	pageSize
) {
	try {
		let response = await API.get(
			`${Apis.siteAppPauseReasons}?pageNumber=${pageNumber}&pageSize=${pageSize}&siteAppID=${siteAppID}`
		);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
}
export async function getSiteApplicationStopReasonHistory(
	siteAppID,
	pageNumber,
	pageSize
) {
	try {
		let response = await API.get(
			`${Apis.siteAppStopReasons}?pageNumber=${pageNumber}&pageSize=${pageSize}&siteAppID=${siteAppID}`
		);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
}
export async function getSiteApplicationSkippedTaskReasonHistory(
	siteAppID,
	pageNumber,
	pageSize
) {
	try {
		let response = await API.get(
			`${Apis.siteAppSkipReasons}?pageNumber=${pageNumber}&pageSize=${pageSize}&siteAppID=${siteAppID}`
		);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
}
export async function getSiteApplicationMissingPartToolReasonHistory(
	siteAppID,
	pageNumber,
	pageSize
) {
	try {
		let response = await API.get(
			`${Apis.siteAppMissingPartToolReasons}?pageNumber=${pageNumber}&pageSize=${pageSize}&siteAppID=${siteAppID}`
		);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
}
export async function getSiteApplicationStatusChangeReasonHistory(
	siteAppID,
	pageNumber,
	pageSize
) {
	try {
		let response = await API.get(
			`${Apis.siteAppChangeStatusReasons}?pageNumber=${pageNumber}&pageSize=${pageSize}&siteAppID=${siteAppID}`
		);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
}
export async function getSiteApplicationModelStatusHistory(
	siteAppID,
	pageNumber,
	pageSize
) {
	try {
		let response = await API.get(
			`${Apis.siteAppModelStatuses}?pageNumber=${pageNumber}&pageSize=${pageSize}&siteAppID=${siteAppID}`
		);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
}
export async function getSiteApplicationModelTypeHistory(
	siteAppID,
	pageNumber,
	pageSize
) {
	try {
		let response = await API.get(
			`${Apis.siteAppModelTypes}?pageNumber=${pageNumber}&pageSize=${pageSize}&siteAppID=${siteAppID}`
		);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
}
export async function getSiteApplicationTaskActionHistory(
	siteAppID,
	pageNumber,
	pageSize
) {
	try {
		let response = await API.get(
			`${Apis.siteAppActions}?pageNumber=${pageNumber}&pageSize=${pageSize}&siteAppID=${siteAppID}`
		);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
}
export async function getSiteApplicationTaskOperatingModeHistory(
	siteAppID,
	pageNumber,
	pageSize
) {
	try {
		let response = await API.get(
			`${Apis.siteAppOperatingModes}?pageNumber=${pageNumber}&pageSize=${pageSize}&siteAppID=${siteAppID}`
		);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
}
export async function getSiteApplicationTaskSystemHistory(
	siteAppID,
	pageNumber,
	pageSize
) {
	try {
		let response = await API.get(
			`${Apis.siteAppSystems}?pageNumber=${pageNumber}&pageSize=${pageSize}&siteAppID=${siteAppID}`
		);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
}
export async function getSiteApplicationUserPositionHistory(
	siteAppID,
	pageNumber,
	pageSize
) {
	try {
		let response = await API.get(
			`${Apis.siteAppPositions}?pageNumber=${pageNumber}&pageSize=${pageSize}&siteAppID=${siteAppID}`
		);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
}
export async function getSiteApplicationUserRoleHistory(
	siteAppID,
	pageNumber,
	pageSize
) {
	try {
		let response = await API.get(
			`${Apis.siteAppRoles}?pageNumber=${pageNumber}&pageSize=${pageSize}&siteAppID=${siteAppID}`
		);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
}
export async function getSiteApplicationDefectRiskRatingHistory(
	siteAppID,
	pageNumber,
	pageSize
) {
	try {
		let response = await API.get(
			`${Apis.siteAppDefectRiskRatings}?pageNumber=${pageNumber}&pageSize=${pageSize}&siteAppID=${siteAppID}`
		);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
}
export async function getSiteApplicationDefectStatusHistory(
	siteAppID,
	pageNumber,
	pageSize
) {
	try {
		let response = await API.get(
			`${Apis.siteAppDefectStatuses}?pageNumber=${pageNumber}&pageSize=${pageSize}&siteAppID=${siteAppID}`
		);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
}
export async function getSiteApplicationDefectTypeHistory(
	siteAppID,
	pageNumber,
	pageSize
) {
	try {
		let response = await API.get(
			`${Apis.siteAppDefectTypes}?pageNumber=${pageNumber}&pageSize=${pageSize}&siteAppID=${siteAppID}`
		);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
}
export async function getSiteApplicationFeedbackClassificationHistory(
	siteAppID,
	pageNumber,
	pageSize
) {
	try {
		let response = await API.get(
			`${Apis.siteAppFeedbackClassifications}?pageNumber=${pageNumber}&pageSize=${pageSize}&siteAppID=${siteAppID}`
		);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
}
export async function getSiteApplicationFeedbackPriorityHistory(
	siteAppID,
	pageNumber,
	pageSize
) {
	try {
		let response = await API.get(
			`${Apis.siteAppFeedbackPriorities}?pageNumber=${pageNumber}&pageSize=${pageSize}&siteAppID=${siteAppID}`
		);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
}
export async function getSiteApplicationFeedbackStatusHistory(
	siteAppID,
	pageNumber,
	pageSize
) {
	try {
		let response = await API.get(
			`${Apis.siteAppFeedbackStatus}?pageNumber=${pageNumber}&pageSize=${pageSize}&siteAppID=${siteAppID}`
		);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
}
export async function getSiteApplicationTaskLubricants(
	siteAppID,
	pageNumber,
	pageSize
) {
	try {
		let response = await API.get(
			`${Apis.siteAppLubricants}?pageNumber=${pageNumber}&pageSize=${pageSize}&siteAppID=${siteAppID}`
		);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
}
