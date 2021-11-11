import API from "helpers/api";
import { Apis } from "services/api";
import { getAPIResponse } from "helpers/getApiResponse";

//#region get users profile
const getUserProfile = async () => {
	try {
		let response = await API.get(`${Apis.UserProfile}`);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};

//#endregion

// #region patch notes
const patchUserProfile = async (id = "me", data) => {
	try {
		let response = await API.patch(`${Apis.UserProfile}`, data);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};
//end

// #region patch notes
const patchSwitchUserProfile = async (id = "me", data) => {
	try {
		let response = await API.patch(`${Apis.UserProfile}`, data);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};
//end

// #region post user profile
const postUserProfile = async (data) => {
	try {
		let response = await API.post(`${Apis.UserProfilePasswordChange}`, data);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};
//end

// #region post notes
const postPasswordReset = async (id, data) => {
	try {
		let response = await API.post(
			`${Apis.UsersList}/${id}/changepassword`,
			data
		);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};
//end

export {
	getUserProfile,
	patchUserProfile,
	postUserProfile,
	postPasswordReset,
	patchSwitchUserProfile,
};
