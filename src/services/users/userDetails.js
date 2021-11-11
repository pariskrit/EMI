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
		let response = await API.patch(`${Apis.UserDetailReference}/${id}`, data);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};
//end

// #region patch notes
const patchSwitchUserDetails = async (id, data) => {
	try {
		let response = await API.patch(`${Apis.UsersList}/${id}`, data);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};
//end

export {
	getUserDetailsNotes,
	getUserDetails,
	postUserDetailsNote,
	patchUserDetails,
	patchExternalReference,
	patchSwitchUserDetails,
};
