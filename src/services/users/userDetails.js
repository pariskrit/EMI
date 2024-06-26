import API from "helpers/api";
import { Apis } from "services/api";
import { getAPIResponse } from "helpers/getApiResponse";

//#region get users detail
const getUserDetails = async (id) => {
	try {
		let response = await API.get(`${Apis.UsersList}/${id}`);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};

const getClientUserDetails = async (id) => {
	try {
		let response = await API.get(`${Apis.userDetailSites}/${id}`);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};

export const getClientUserSiteAppDetail = async (id) => {
	try {
		let response = await API.get(`${Apis.ClientUserSiteApps}/${id}`);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};

export const getClientUserSiteAppList = async ({
	siteAppId,
	pageNumber = 1,
	pageSize = 10,
	search = "",
}) => {
	try {
		let response = await API.get(
			`${
				Apis.ClientUserSiteApps
			}?siteAppId=${siteAppId}&pageNumber=${pageNumber}&pageSize=${pageSize}&search=${search}&excludeKeyContacts=${true}`
		);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};

export const getClientUserSiteAppListCount = async ({
	siteAppId,
	search = "",
}) => {
	try {
		let response = await API.get(
			`${Apis.ClientUserSiteApps}/count?siteAppId=${siteAppId}&search=${search}`
		);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};

//endnd

//#region notes
const getUserDetailsNotes = async (id) => {
	try {
		let response = await API.get(`${Apis.UserDetailsNote}${id}`);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};

//end

// #region post notes
const postUserDetailsNote = async (data) => {
	try {
		let response = await API.post(`${Apis.UserDetailsNotePost}`, data);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};
//end

// #region patch notes
const patchUserDetails = async (id, data) => {
	try {
		let response = await API.patch(`${Apis.UsersList}/${id}`, data);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};
//end

// #region patch notes
const patchExternalReference = async (id, data) => {
	try {
		let response = await API.patch(`${Apis.userDetailSites}/${id}`, data);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};
//end

// #region patch notes
const patchSwitchUserDetails = async (id, data) => {
	try {
		let response = await API.patch(`${Apis.ClientUser}/${id}`, data);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};

// #region patch notes
const patchSwitchClientUserDetails = async (id, data) => {
	try {
		let response = await API.patch(`${Apis.ClientUserSitesApps}/${id}`, data);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};

//end

export {
	getClientUserDetails,
	getUserDetailsNotes,
	getUserDetails,
	postUserDetailsNote,
	patchUserDetails,
	patchExternalReference,
	patchSwitchUserDetails,
	patchSwitchClientUserDetails,
};
