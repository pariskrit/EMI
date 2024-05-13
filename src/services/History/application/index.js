import API from "helpers/api";
import { getAPIResponse } from "helpers/getApiResponse";
import { Apis } from "services/api";

export async function getApplicationDetails(id, pageNumber, pageSize) {
	try {
		let response = await API.get(
			`${Apis.appDetails}?pageNumber=${pageNumber}&pageSize=${pageSize}&id=${id}`
		);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
}

export async function getApplicationPauseReason(id, pageNumber, pageSize) {
	try {
		let response = await API.get(
			`${Apis.appPauseReason}?pageNumber=${pageNumber}&pageSize=${pageSize}&id=${id}`
		);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
}
export async function getApplicationStopReason(id, pageNumber, pageSize) {
	try {
		let response = await API.get(
			`${Apis.appStopReason}?pageNumber=${pageNumber}&pageSize=${pageSize}&id=${id}`
		);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
}

export async function getApplicationSkipReason(id, pageNumber, pageSize) {
	try {
		let response = await API.get(
			`${Apis.appSkipReason}?pageNumber=${pageNumber}&pageSize=${pageSize}&id=${id}`
		);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
}
export async function getApplicationMissingPartToolReason(
	id,
	pageNumber,
	pageSize
) {
	try {
		let response = await API.get(
			`${Apis.appMissingPartToolReason}?pageNumber=${pageNumber}&pageSize=${pageSize}&id=${id}`
		);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
}

export async function getApplicationChangeStatusReason(
	id,
	pageNumber,
	pageSize
) {
	try {
		let response = await API.get(
			`${Apis.appChangeStatusReason}?pageNumber=${pageNumber}&pageSize=${pageSize}&id=${id}`
		);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
}

export async function getApplicationModelStatuses(id, pageNumber, pageSize) {
	try {
		let response = await API.get(
			`${Apis.appChangeModelStatus}?pageNumber=${pageNumber}&pageSize=${pageSize}&id=${id}`
		);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
}

export async function getApplicationModelTypes(id, pageNumber, pageSize) {
	try {
		let response = await API.get(
			`${Apis.appChangeModelTypes}?pageNumber=${pageNumber}&pageSize=${pageSize}&id=${id}`
		);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
}

export async function getApplicationActions(id, pageNumber, pageSize) {
	try {
		let response = await API.get(
			`${Apis.appActions}?pageNumber=${pageNumber}&pageSize=${pageSize}&id=${id}`
		);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
}

export async function getApplicationSystems(id, pageNumber, pageSize) {
	try {
		let response = await API.get(
			`${Apis.appSystems}?pageNumber=${pageNumber}&pageSize=${pageSize}&id=${id}`
		);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
}

export async function getApplicationOperaingModes(id, pageNumber, pageSize) {
	try {
		let response = await API.get(
			`${Apis.appOperaingModes}?pageNumber=${pageNumber}&pageSize=${pageSize}&id=${id}`
		);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
}

export async function getApplicationPositions(id, pageNumber, pageSize) {
	try {
		let response = await API.get(
			`${Apis.appPositions}?pageNumber=${pageNumber}&pageSize=${pageSize}&id=${id}`
		);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
}
export async function getApplicationRoles(id, pageNumber, pageSize) {
	try {
		let response = await API.get(
			`${Apis.appRoles}?pageNumber=${pageNumber}&pageSize=${pageSize}&id=${id}`
		);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
}

export async function getApplicationDefectRiskRatings(
	id,
	pageNumber,
	pageSize
) {
	try {
		let response = await API.get(
			`${Apis.appDefectRiskRatings}?pageNumber=${pageNumber}&pageSize=${pageSize}&id=${id}`
		);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
}

export async function getApplicationDefectStatuses(id, pageNumber, pageSize) {
	try {
		let response = await API.get(
			`${Apis.appDefectStatuses}?pageNumber=${pageNumber}&pageSize=${pageSize}&id=${id}`
		);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
}

export async function getApplicationDefectTypes(id, pageNumber, pageSize) {
	try {
		let response = await API.get(
			`${Apis.appDefectTypes}?pageNumber=${pageNumber}&pageSize=${pageSize}&id=${id}`
		);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
}

export async function getApplicationFeedbackClassifications(
	id,
	pageNumber,
	pageSize
) {
	try {
		let response = await API.get(
			`${Apis.appFeedbackClassifications}?pageNumber=${pageNumber}&pageSize=${pageSize}&id=${id}`
		);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
}
export async function getApplicationFeedbackPriorities(
	id,
	pageNumber,
	pageSize
) {
	try {
		let response = await API.get(
			`${Apis.appFeedbackPriorities}?pageNumber=${pageNumber}&pageSize=${pageSize}&id=${id}`
		);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
}
export async function getApplicationFeedbackStatuses(id, pageNumber, pageSize) {
	try {
		let response = await API.get(
			`${Apis.appFeedbackStatuses}?pageNumber=${pageNumber}&pageSize=${pageSize}&id=${id}`
		);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
}
