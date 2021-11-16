import API from "helpers/api";
import { Apis } from "services/api";
import { getAPIResponse } from "helpers/getApiResponse";

//#region get user list
const getUsersList = async (pNo, pSize, search = "") => {
	try {
		let pageSearchField =
			pNo !== null ? `&&pageNumber=${pNo}&&pageSize=${pSize}` : "";
		let response = await API.get(
			`${Apis.UsersList}?${pageSearchField}&&search=${search}`
		);
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

export { getUsersList, addUserToList, importUserList };
