import React, { useContext, useEffect, useState } from "react";
import { SiteContext } from "contexts/SiteApplicationContext";
import CommonHeaderWrapper from "components/Modules/CommonHeaderWrapper";
import SiteApplicationNavigation from "constants/navigation/siteAppNavigation";
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
			{state.loading ? (
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
