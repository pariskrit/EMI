import API from "helpers/api";
import { Apis } from "services/api";
import { getAPIResponse } from "helpers/getApiResponse";

const getClientDetails = async (clientId) => {
	try {
		const response = await API.get(`${Apis.Clients}/${clientId}`);
		return getAPIResponse(response);
	} catch (error) {
		return getAPIResponse(error.response);
	}
};

const updateClientDetails = async (clientId, data) => {
	try {
		const response = await API.patch(`${Apis.Clients}/${clientId}`, data);
		return getAPIResponse(response);
	} catch (error) {
		return getAPIResponse(error.response);
	}
};

const updateClientLogo = async (clientId, data) => {
	try {
		const response = await API.patch(`${Apis.Clients}/${clientId}`, data);
		return getAPIResponse(response);
	} catch (error) {
		return getAPIResponse(error.response);
	}
};

const addClientRegion = async (data) => {
	try {
		const response = await API.post(`${Apis.ClientRegion}`, data);
		return getAPIResponse(response);
	} catch (error) {
		return getAPIResponse(error.response);
	}
};

const getClientRegion = async (clientId) => {
	try {
		const response = await API.get(`${Apis.ClientRegion}?clientId=${clientId}`);
		return getAPIResponse(response);
	} catch (error) {
		return getAPIResponse(error.response);
	}
};

const addClientSite = async (data) => {
	try {
		const response = await API.post(`${Apis.ClientSite}`, data);
		return getAPIResponse(response);
	} catch (error) {
		return getAPIResponse(error.response);
	}
};

const addClientDocument = async (data) => {
	try {
		const response = await API.post(`${Apis.ClientDocument}`, data);
		return getAPIResponse(response);
	} catch (error) {
		return getAPIResponse(error.response);
	}
};

const getClientDocument = async (id) => {
	try {
		const response = await API.get(`${Apis.ClientDocument}?clientId=${id}`);
		return getAPIResponse(response);
	} catch (error) {
		return getAPIResponse(error.response);
	}
};

const getClientKeyContacts = async (clientId) => {
	try {
		const response = await API.get(`${Apis.Clients}/${clientId}/keycontacts`);
		return getAPIResponse(response);
	} catch (error) {
		return getAPIResponse(error.response);
	}
};

const getClientApplications = async (clientId) => {
	try {
		const response = await API.get(
			`${Apis.ClientApplication}?clientid=${clientId}`
		);
		return getAPIResponse(response);
	} catch (error) {
		return getAPIResponse(error.response);
	}
};

const addClientApplications = async (data) => {
	try {
		const response = await API.post(`${Apis.ClientApplication}`, data);
		return getAPIResponse(response);
	} catch (error) {
		return getAPIResponse(error.response);
	}
};

const updateClientApplications = async (changeId, data) => {
	try {
		const response = await API.patch(
			`${Apis.ClientApplication}/${changeId}`,
			data
		);
		return getAPIResponse(response);
	} catch (error) {
		return getAPIResponse(error.response);
	}
};

const getClientNotes = async (clientId) => {
	try {
		const response = await API.get(`${Apis.ClientNote}?clientid=${clientId}`);
		return getAPIResponse(response);
	} catch (error) {
		return getAPIResponse(error.response);
	}
};

const addClientNote = async (data) => {
	try {
		const response = await API.post(`${Apis.ClientNote}`, data);
		return getAPIResponse(response);
	} catch (error) {
		return getAPIResponse(error.response);
	}
};

export {
	getClientDetails,
	updateClientDetails,
	updateClientLogo,
	addClientRegion,
	getClientRegion,
	addClientSite,
	getClientDocument,
	addClientDocument,
	getClientKeyContacts,
	getClientApplications,
	addClientApplications,
	updateClientApplications,
	getClientNotes,
	addClientNote,
};
