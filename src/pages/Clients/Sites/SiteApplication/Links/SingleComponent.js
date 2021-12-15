import React, { useContext, useEffect, useState } from "react";
import { SiteContext } from "contexts/SiteApplicationContext";
import CommonHeaderWrapper from "components/Modules/CommonHeaderWrapper";
import SiteApplicationNavigation from "constants/navigation/siteAppNavigation";
import { getSiteApplicationDetail } from "services/clients/sites/siteApplications/siteApplicationDetails";
import { getDefaultCustomCaptions } from "services/clients/sites/siteApplications/customCaptions";
import CircularProgress from "@material-ui/core/CircularProgress";
import ContentStyle from "styles/application/ContentStyle";
import { clientsPath, siteDetailPath } from "helpers/routePaths";

const AC = ContentStyle();

const SingleComponent = (route) => {
	const {
		location,
		match: {
			params: { clientId, id, appId },
		},
	} = route;

	const [state, dispatch] = useContext(SiteContext);
	const [loading, setLoading] = useState(true);

	const navigation = SiteApplicationNavigation(
		clientId,
		id,
		appId,
		state.details?.data,
		state.defaultCustomCaptionsData
	);

	const openAddModal = () => dispatch({ type: "ADD_TOGGLE" });
	let crumbs = JSON.parse(localStorage.getItem("crumbs"));

	const openConfirmationModal = () =>
		dispatch({ type: "TOGGLE_CONFIRMATION_MODAL", payload: true });

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
			} else {
				// If error, throwing to catch
				throw new Error(result);
			}
		} catch (err) {
			return false;
		}
	};

	const fetchData = async () => {
		if (
			location.pathname.split("/")[8] === "detail" ||
			Object.keys(state.details).length === 0
		) {
			const response = await fetchSiteApplicationDetails();
			await fetchDefaultCustomCaptionsData(response.applicationID);
		}

		setLoading(false);
	};

	useEffect(() => {
		fetchData();

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	let crumbState = [];

	if (location.pathname.split("/")[8] !== "detail" && crumbs?.applicationName) {
		crumbState = [
			{ id: 1, name: crumbs.clientName, url: clientsPath + `/${clientId}` },
			{
				id: 2,
				name: crumbs.siteName,
				url: `${clientsPath}/${clientId}/sites/${id}${siteDetailPath}`,
			},
			{
				id: 3,
				name: crumbs.applicationName,
			},
		];
	}

	return (
		<>
			{loading ? (
				<AC.SpinnerContainer>
					<CircularProgress />
				</AC.SpinnerContainer>
			) : (
				<div className="container">
					<CommonHeaderWrapper
						crumbs={crumbState}
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
							clientId={clientId}
							apis={route.api}
							showDefault={route.showDefault}
							pathToPatch={route.pathToPatch}
							singleCaption={route.singleCaption}
							pluralCaption={route.pluralCaption}
							isMissingPartOrTools={route.isMissingPartOrTools}
						/>
					}
				</div>
			)}
		</>
	);
};

export default SingleComponent;
