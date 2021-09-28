import API from "helpers/api";
import { Apis } from "services/api";
import { getAPIResponse } from "helpers/getApiResponse";

//#region get defect risk ratings
const getDefectRiskRatings = async (id) => {
	try {
		let response = await API.get(`${Apis.DefectRiskRatings}?siteAppId=${id}`);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};

//end

//#region get defect risk ratings
const getDefaultDefectRiskRatings = async (id) => {
	try {
		let response = await API.get(`/api/SiteApps/${id}/defaults`);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};

//end

//#region get defect risk ratings
const addDefectRiskRatings = async (requestData) => {
	try {
		let response = await API.post(Apis.DefectRiskRatings, requestData);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};

//end

//#region get defect risk ratings
const patchDefectRiskRatings = async (id, requestData) => {
	try {
		let response = await API.patch(
			`${Apis.DefectRiskRatings}/${id}`,
			requestData
		);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};

//end

//#region get defect risk ratings
const patchDefaultDefectRiskRatings = async (id, requestData) => {
	try {
		let response = await API.patch(`/api/siteapps/${id}`, requestData);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};

//end

export {
	addDefectRiskRatings,
	getDefectRiskRatings,
	patchDefectRiskRatings,
	getDefaultDefectRiskRatings,
	patchDefaultDefectRiskRatings,
};
