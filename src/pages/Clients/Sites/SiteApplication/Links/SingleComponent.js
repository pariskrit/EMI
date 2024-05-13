import React, { useContext, useEffect } from "react";
import { SiteContext } from "contexts/SiteApplicationContext";
import CommonHeaderWrapper from "components/Modules/CommonHeaderWrapper";
import SiteApplicationNavigation from "constants/navigation/siteAppNavigation";
import CircularProgress from "@mui/material/CircularProgress";
import ContentStyle from "styles/application/ContentStyle";
import { appPath, clientsPath, siteDetailPath } from "helpers/routePaths";
import { useLocation, useParams } from "react-router-dom";

const AC = ContentStyle();

const SingleComponent = (route) => {
	const location = useLocation();
	const { clientId, id, appId } = useParams();

	const { position, siteAppID, role } =
		JSON.parse(sessionStorage.getItem("me")) ||
		JSON.parse(localStorage.getItem("me"));

	const changeReadonly = position?.settingsAccess === "R";
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

	if (
		(location.pathname.split("/")[8] !== "detail" ||
			location.pathname.split("/")[8] !== "customcaptions") &&
		crumbs?.applicationName
	) {
		crumbState = [
			{
				id: 1,
				name: crumbs.clientName,
				url: appPath + clientsPath + `/${clientId}`,
			},
			{
				id: 2,
				name: crumbs.siteName,
				url: `${appPath}${clientsPath}/${clientId}/sites/${id}/${siteDetailPath}`,
			},
			{
				id: 3,
				name: crumbs.applicationName,
			},
		];
	}
	useEffect(() => {
		if (siteAppID) {
			dispatch({ type: "CHANGE_ISREADONLY", payload: changeReadonly });
		} else {
			dispatch({ type: "CHANGE_ISREADONLY", payload: false });
		}
	}, [changeReadonly, dispatch, siteAppID]);

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
							location.state !== undefined && location.state !== null
								? location.state.applicationName
								: state.applicationName
						}
						showAdd={route.showAdd && !state?.isReadOnly}
						onClickAdd={openAddModal}
						showSwitch={route.showSwitch && !state?.isReadOnly}
						handlePatchIsActive={openConfirmationModal}
						showHistory={route.showHistory}
						currentStatus={state.isActive}
						role={role}
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
