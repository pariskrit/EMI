import { siteDetailSlice } from "./reducers";
import { getSiteDetails } from "services/clients/sites/siteDetails";
import { clientsPath } from "helpers/routePaths";

const { setSiteDetail, setCrumbs } = siteDetailSlice.actions;

export const fetchSiteDetail = (siteId, clientId) => async (dispatch) => {
	try {
		const result = await getSiteDetails(siteId);
		const crumbs = [
			{
				id: 1,
				name: result.data.clientName,
				url: clientsPath + `/${clientId}`,
			},
			{
				id: 2,
				name: result.data.regionName,
				url: clientsPath + `/${clientId}`,
			},
			{ id: 3, name: result.data.name },
		];
		dispatch(setSiteDetail({ data: result.data, crumbs }));
		return result;
	} catch (error) {
		console.log(error);
	}
};

export const setNavCrumbs = (crumbs) => setCrumbs(crumbs);
