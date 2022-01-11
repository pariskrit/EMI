import API from "helpers/api";
import { Apis } from "services/api";
import { getAPIResponse } from "helpers/getApiResponse";

//#region get users detail
const getModelMapData = async (id) => {
	try {
		let response = await API.get(`${Apis.ModelImports}/${id}`);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};

const importModelMapData = async (id) => {
	try {
		let response = await API.post(`${Apis.ModelImports}/${id}/import`);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};

export { getModelMapData, importModelMapData };
