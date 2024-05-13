import API from "helpers/api";
import { getAPIResponse } from "helpers/getApiResponse";
import { Apis } from "services/api";

export async function DetailPage(
	modelVersionId,
	pageNumber = 1,
	pageSize = 10
) {
	try {
		let response = await API.get(
			`${Apis.modelhistorydetail}${modelVersionId}?pageNumber=${pageNumber}&pageSize=${pageSize}`
		);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
}

export async function AssetsPage(modelId, pageNumber = 1, pageSize = 10) {
	try {
		let response = await API.get(
			`${Apis.modelhistoryassets}${modelId}&pageNumber=${pageNumber}&pageSize=${pageSize}`
		);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
}

export async function ArrangementPage(
	modelVersionId,
	pageNumber = 1,
	pageSize = 10
) {
	try {
		let response = await API.get(
			`${Apis.modelhistoryarrangement}${modelVersionId}&pageNumber=${pageNumber}&pageSize=${pageSize}`
		);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
}

export async function StagesPage(
	modelVersionId,
	pageNumber = 1,
	pageSize = 10
) {
	try {
		let response = await API.get(
			`${Apis.modelhistorystages}${modelVersionId}&pageNumber=${pageNumber}&pageSize=${pageSize}`
		);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
}

export async function ZonesPage(modelVersionId, pageNumber = 1, pageSize = 10) {
	try {
		let response = await API.get(
			`${Apis.modelhistoryzones}${modelVersionId}&pageNumber=${pageNumber}&pageSize=${pageSize}`
		);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
}

export async function IntervalPage(
	modelVersionId,
	pageNumber = 1,
	pageSize = 10
) {
	try {
		let response = await API.get(
			`${Apis.modelhistoryinterval}${modelVersionId}&pageNumber=${pageNumber}&pageSize=${pageSize}`
		);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
}

export async function RolesPage(modelVersionId, pageNumber = 1, pageSize = 10) {
	try {
		let response = await API.get(
			`${Apis.modelhistoryrole}${modelVersionId}&pageNumber=${pageNumber}&pageSize=${pageSize}`
		);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
}

export async function QuestionsPage(
	modelVersionId,
	pageNumber = 1,
	pageSize = 10
) {
	try {
		let response = await API.get(
			`${Apis.modelhistoryquestions}${modelVersionId}&pageNumber=${pageNumber}&pageSize=${pageSize}`
		);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
}

export async function TasksPage(modelVersionId, pageNumber = 1, pageSize = 10) {
	try {
		let response = await API.get(
			`${Apis.modelhistorytasks}${modelVersionId}&pageNumber=${pageNumber}&pageSize=${pageSize}`
		);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
}

export async function defectsPage(defectId, pageNumber = 1, pageSize = 10) {
	try {
		let response = await API.get(
			`${Apis.defectsHistory}${defectId}?pageNumber=${pageNumber}&pageSize=${pageSize}`
		);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
}

export async function servicesPage(serviceId, pageNumber = 1, pageSize = 10) {
	try {
		let response = await API.get(
			`${Apis.serviceDetailHistory}${serviceId}?pageNumber=${pageNumber}&pageSize=${pageSize}`
		);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
}

export async function feedBackPage(feedbackId, pageNumber = 1, pageSize = 10) {
	try {
		let response = await API.get(
			`${Apis.feedbacksHistory}${feedbackId}?pageNumber=${pageNumber}&pageSize=${pageSize}`
		);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
}

export async function clientUserSiteAppPage(
	clientUserSiteAppId,
	pageNumber = 1,
	pageSize = 10
) {
	try {
		let response = await API.get(
			`${Apis.clientUserSitesHistory}${clientUserSiteAppId}?pageNumber=${pageNumber}&pageSize=${pageSize}`
		);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
}

export async function noticeBoardsPage(
	siteAppId,
	pageNumber = 1,
	pageSize = 10
) {
	try {
		let response = await API.get(
			`${Apis.noticeBoardsHistory}${siteAppId}&pageNumber=${pageNumber}&pageSize=${pageSize}`
		);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
}
