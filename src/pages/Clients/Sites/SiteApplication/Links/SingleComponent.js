import React, { useContext, useEffect, useState } from "react";
import { SiteContext } from "contexts/SiteApplicationContext";
import { useParams, useLocation } from "react-router";
import CommonHeaderWrapper from "components/Modules/CommonHeaderWrapper";
import SiteApplicationNavigation from "constants/navigation/siteAppNavigation";
import { getSiteApplicationDetail } from "services/clients/sites/siteApplications/siteApplicationDetails";
import { getDefaultCustomCaptions } from "services/clients/sites/siteApplications/customCaptions";
import CircularProgress from "@material-ui/core/CircularProgress";
import ContentStyle from "styles/application/ContentStyle";

const AC = ContentStyle();

const SingleComponent = (route) => {
	const location = useLocation();
	const siteAppIds = useParams();
	const { clientId, id, appId } = siteAppIds;
	const [state, dispatch] = useContext(SiteContext);
	const [loading, setLoading] = useState(true);

	const navigation = SiteApplicationNavigation(
		clientId,
		id,
		appId,
		state.defaultCustomCaptionsData
	);

	let crumbs = JSON.parse(localStorage.getItem("crumbs"));

	const openAddModal = () => dispatch({ type: "ADD_TOGGLE" });

	const openConfirmationModal = () =>
		dispatch({ type: "TOGGLE_CONFIRMATION_MODAL", payload: true });

	const fetchSiteApplicationDetails = async () => {
		const result = await getSiteApplicationDetail(appId);

		if (!crumbs.hasOwnProperty("applicationName")) {
			localStorage.setItem(
				"crumbs",
				JSON.stringify({
					...crumbs,
					applicationName: result.data.application.name,
				})
			);
		}

		if (result.status) {
			dispatch({
				type: "SET_SITE_APP_DETAIL",
				payload: result,
			});

			dispatch({
				type: "TOGGLE_ISACTIVE",
				payload: result.data.isActive,
			});
		}
	};

	const fetchDefaultCustomCaptionsData = async () => {
		try {
			let result = await getDefaultCustomCaptions(appId);
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
					payload: nullReplaced,
				});
			} else {
				// If error, throwing to catch
				throw new Error(result);
			}
		} catch (err) {
			console.log(err);
			return false;
		}
	};

	const fetchData = async () => {
		if (Object.keys(state.details).length === 0) {
			await fetchSiteApplicationDetails();
		}

		if (Object.keys(state.defaultCustomCaptionsData).length === 0) {
			await fetchDefaultCustomCaptionsData();
		}
		setLoading(false);
	};

	useEffect(() => {
		fetchData();

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const { clientName, siteName, applicationName } = crumbs;
	return (
		<>
			{loading ? (
				<AC.SpinnerContainer>
					<CircularProgress />
				</AC.SpinnerContainer>
			) : (
				<div className="container">
					<CommonHeaderWrapper
						crumbs={[clientName, siteName, applicationName]}
						navigation={navigation}
						current={route.name}
						applicationName={
							location.state !== undefined
								? location.state.applicationName
								: state.applicationName
						}
						showAdd={route.showAdd}
						onClickAdd={openAddModal}
						showSwitch={route.showSwitch}
						handlePatchIsActive={openConfirmationModal}
						showHistory={route.showHistory}
						currentStatus={state.isActive}
					/>
					{
						<route.component
							state={state}
							dispatch={dispatch}
							appId={appId}
							header={route.header}
							subHeader={route.subHeader}
							apis={route.api}
							showDefault={route.showDefault}
							pathToPatch={route.pathToPatch}
						/>
					}
				</div>
			)}
		</>
	);
};

export default SingleComponent;
