import { siteDetailSlice } from "./reducers";
import { getSiteDetails } from "services/clients/sites/siteDetails";

const { setSiteDetail, setCrumbs } = siteDetailSlice.actions;

export const fetchSiteDetail = (siteId) => async (dispatch) => {
	try {
		const result = await getSiteDetails(siteId);

		dispatch(setSiteDetail({ data: result.data }));
		return result;
	} catch (error) {
		console.log(error);
	}
};

export const setNavCrumbs = (crumbs) => setCrumbs(crumbs);
