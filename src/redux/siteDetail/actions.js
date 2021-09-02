import { siteDetailSlice } from "./reducers";
import API from "helpers/api";
import { BASE_API_PATH } from "helpers/constants";

const { setSiteDetail } = siteDetailSlice.actions;

export const fetchSiteDetail = (siteId) => async (dispatch) => {
	try {
		const result = await API.get(`${BASE_API_PATH}sites/${siteId}`);

		dispatch(setSiteDetail({ data: result.data }));
		return result;
	} catch (error) {
		console.log(error);
	}
};
