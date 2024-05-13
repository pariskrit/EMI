import API from "helpers/api";
import { Apis } from "services/api";
import { getAPIResponse } from "helpers/getApiResponse";

//#region get user list
const getUsersList = async (
	pNo,
	pSize,
	search = "",
	sort = "",
	sortField = ""
) => {
	try {
		let pageSearchField =
			pNo !== null ? `&&pageNumber=${pNo}&&pageSize=${pSize}` : "";
		let response = await API.get(
			`${Apis.UsersList}?${pageSearchField}&&search=${search}&&sort=${sort}&&sortField=${sortField}`
		);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};

const getUsersListCount = async (searchText = "") => {
	try {
		let response = await API.get(
			`${Apis.UsersList}/count?search=${searchText}`
		);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};

const getClientAdminUserList = async (
	id,
	pageNumber,
	pageSize,
	searchText = "",
	sort = "",
	sortField = ""
) => {
	try {
		const response = await API.get(
			`${Apis.userDetailSites}?clientId=${id}&pageNumber=${pageNumber}&pageSize=${pageSize}&search=${searchText}&sort=${sort}&sortField=${sortField}`
		);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};

const getClientAdminUserListCount = async (id, searchText = "") => {
	try {
		const response = await API.get(
			`${Apis.userDetailSites}/count?clientId=${id}&search=${searchText}`
		);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};

const getSiteAppUserList = async (
	id,
	pageNumber = 1,
	pageSize = 12,
	search = "",
	sort = "",
	sortField = ""
) => {
	try {
		const response = await API.get(
			`${Apis.ClientUserSitesApps}?siteAppId=${id}&pageNumber=${pageNumber}&pageSize=${pageSize}&search=${search}&sort=${sort}&sortField=${sortField}`
		);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};

const getSiteAppUserListCount = async (id, searchText = "") => {
	try {
		const response = await API.get(
			`${Apis.ClientUserSitesApps}/count?siteAppId=${id}&search=${searchText}`
		);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};

export const downloadUserCSVTemplate = async (path) => {
	try {
		let response = await API.get(`${path}/downloadImportTemplate`);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};

//end

//#region add user
const addUserToList = async (data) => {
	try {
		let response = await API.post(`${Apis.UsersList}/register`, data);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};

// adding User in Site application context
export const addClientUserSiteApps = async (payload) => {
	try {
		let response = await API.post(
			`${Apis.ClientUserSitesApps}/adduser`,
			payload
		);
		return getAPIResponse(response);
	} catch (error) {
		return getAPIResponse(error?.response);
	}
};

// adding User in Client Admin context
export const addClientUsers = async (payload) => {
	try {
		let response = await API.post(`${Apis.userDetailSites}`, payload);
		return getAPIResponse(response);
	} catch (error) {
		return getAPIResponse(error?.response);
	}
};

//end

// Import from list
const importUserList = async (data) => {
	try {
		let response = await API.post(`${Apis.UsersList}/importusers`, data);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};

//resend Inviatation
const resendInvitation = async (data) => {
	try {
		let response = await API.post(`${Apis.UsersList}/resendinvite`, data);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};

export {
	getUsersList,
	getUsersListCount,
	addUserToList,
	importUserList,
	getClientAdminUserList,
	getClientAdminUserListCount,
	getSiteAppUserList,
	getSiteAppUserListCount,
	resendInvitation,
};
