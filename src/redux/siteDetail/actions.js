import { siteDetailSlice } from "./reducers";
import { getSiteDetails } from "services/clients/sites/siteDetails";
import { appPath, clientsPath } from "helpers/routePaths";
import { clientPath } from "helpers/routePaths";
import { showError } from "redux/common/actions";
import roles from "helpers/roles";

const { setSiteDetail, setCrumbs } = siteDetailSlice.actions;

export const fetchSiteDetail = (siteId, clientId) => async (dispatch) => {
	const { role } = JSON.parse(localStorage.getItem("me"));
	try {
		const result = await getSiteDetails(siteId);
		const crumbs = [
			{
				id: 1,
				name: result.data.clientName,
				url:
					role === roles.clientAdmin
						? clientPath + `/${clientId}`
						: appPath + clientsPath + `/${clientId}`,
			},
			{
				id: 2,
				name: result.data.regionName,
				url:
					role === roles.clientAdmin
						? clientPath + `/${clientId}`
						: appPath + clientsPath + `/${clientId}`,
			},
			{ id: 3, name: result.data.name },
		];
		dispatch(setSiteDetail({ data: result.data, crumbs }));
		return result;
	} catch (error) {
		dispatch(showError("Failed to load site details."));
	}
};

export const setNavCrumbs = (crumbs) => setCrumbs(crumbs);
