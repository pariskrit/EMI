import { SiteContext } from "contexts/SiteApplicationContext";
import React, { useContext, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { getDefaultCustomCaptions } from "services/clients/sites/siteApplications/customCaptions";
import { getSiteApplicationDetail } from "services/clients/sites/siteApplications/siteApplicationDetails";

function SiteApplication(props) {
	const { pathname } = useLocation();
	const [state, dispatch] = useContext(SiteContext);
	let appId = pathname.split("/")[7];

	const fetchSiteApplicationDetails = async () => {
		const result = await getSiteApplicationDetail(appId);

		if (result.status) {
			dispatch({
				type: "SET_SITE_APP_DETAIL",
				payload: result,
			});

			dispatch({
				type: "TOGGLE_ISACTIVE",
				payload: result.data.isActive,
			});

			return result.data;
		}
	};

	const fetchDefaultCustomCaptionsData = async (applicationId) => {
		try {
			let result = await getDefaultCustomCaptions(applicationId);
			if (result.status) {
				let nullReplaced = result.data;
				Object.keys(nullReplaced).forEach((el) => {
					if (el.indexOf("CC") !== -1 && nullReplaced[el] === null) {
						nullReplaced[el] = "";
					} else {
						return;
					}
				});

				dispatch({
					type: "DEFAULT_CUSTOM_CAPTIONS_DATA",
					payload: {
						...nullReplaced,
						statusChange: "Status Change",
						statusChangePlural: "Status Changes",
					},
				});
				dispatch({ type: "LOADING_COMPLETED" });
			} else {
				// If error, throwing to catch
				throw new Error(result);
			}
		} catch (err) {
			return false;
		}
	};

	const fetchData = async () => {
		const response = await fetchSiteApplicationDetails();
		await fetchDefaultCustomCaptionsData(response?.applicationID);
	};

	useEffect(() => {
		fetchData();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [appId]);

	return <div>{props.children(state?.defaultCustomCaptionsData)}</div>;
}

export default SiteApplication;
