import API from "helpers/api";
import { Apis } from "services/api";
import { getAPIResponse } from "helpers/getApiResponse";

const getLicenseCount = async (siteAppId) => {
	try {
		const response = await API.get(
			`${Apis.Applications}/${siteAppId}/licensecount`
		);

		return getAPIResponse(response);
	} catch (error) {
		return getAPIResponse(error.response);
	}
};
const getLicenses = async (siteAppId) => {
	try {
		const response = await API.get(
			`${Apis.Applications}/${siteAppId}/licenses`
		);

		return getAPIResponse(response);
	} catch (error) {
		return getAPIResponse(error.response);
	}
};
const getCheckedOutServices = async (siteAppId) => {
	try {
		const response = await API.get(
			`${Apis.Applications}/${siteAppId}/checkedOutServices`
		);

		return getAPIResponse(response);
	} catch (error) {
		return getAPIResponse(error.response);
	}
};

const getLicenseDetails = async (siteAppId) => {
	try {
		const response = await API.get(
			`${Apis.Applications}/${siteAppId}/licenseData`
		);

		return getAPIResponse(response);
	} catch (error) {
		return getAPIResponse(error.response);
	}
};

export {
	getLicenseCount,
	getLicenses,
	getCheckedOutServices,
	getLicenseDetails,
};
