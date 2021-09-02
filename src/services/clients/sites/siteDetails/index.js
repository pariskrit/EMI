import API from "helpers/api";
import { Apis } from "services/api";
import { getAPIResponse } from "helpers/getApiResponse";

const getSiteDetails = async (siteId) => {
	try {
		const response = await API.get(`${Apis.SiteDetails}/${siteId}`);

		return getAPIResponse(response);
	} catch (error) {
		return getAPIResponse(error.response);
	}
};

const getListOfRegions = async (clientId) => {
	try {
		const response = await API.get(
			`${Apis.ListOfRegions}/?clientId=${clientId}`
		);

		return getAPIResponse(response);
	} catch (error) {
		return getAPIResponse(error.response);
	}
};

const updateSiteDetails = async (siteId, updatedInput) => {
	try {
		const response = await API.patch(`${Apis.SiteDetails}/${siteId}`, [
			{ op: "replace", path: updatedInput.label, value: updatedInput.value },
		]);

		return getAPIResponse(response);
	} catch (error) {
		return getAPIResponse(error.response);
	}
};

const getSiteAppKeyContacts = async (siteId) => {
	try {
		const response = await API.get(`${Apis.KeyContacts}/${siteId}`);
		return getAPIResponse(response);
	} catch (error) {
		return getAPIResponse(error.response);
	}
};

const getSiteApplications = async (siteId) => {
	try {
		const response = await API.get(`${Apis.Applications}?siteid=${siteId}`);
		return getAPIResponse(response);
	} catch (error) {
		return getAPIResponse(error.response);
	}
};

const getAvailableSiteApplications = async (siteId) => {
	try {
		const response = await API.get(`${Apis.Applications}/${siteId}/available`);
		return getAPIResponse(response);
	} catch (error) {
		return getAPIResponse(error.response);
	}
};

const addSiteApplications = async (siteId, applicationId) => {
	try {
		const response = await API.post(`${Apis.Applications}/`, {
			siteID: siteId,
			applicationID: applicationId,
		});

		return getAPIResponse(response);
	} catch (error) {
		return getAPIResponse(error.response);
	}
};

const updateSiteApplicationStatus = async (applicationToChange) => {
	try {
		const response = await API.patch(
			`${Apis.Applications}/${applicationToChange.id}`,
			[
				{
					op: "replace",
					path: "isActive",
					value: !applicationToChange.isActive,
				},
			]
		);
		return getAPIResponse(response);
	} catch (error) {
		return getAPIResponse(error.response);
	}
};

export {
	getSiteDetails,
	getListOfRegions,
	updateSiteDetails,
	getSiteAppKeyContacts,
	getSiteApplications,
	getAvailableSiteApplications,
	addSiteApplications,
	updateSiteApplicationStatus,
};
