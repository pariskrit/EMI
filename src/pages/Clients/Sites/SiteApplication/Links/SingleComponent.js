import React, { useContext, useEffect } from "react";
import { SiteContext } from "contexts/SiteApplicationContext";
import { useParams, useLocation } from "react-router";
import CommonHeaderWrapper from "components/Modules/CommonHeaderWrapper";
import SiteApplicationNavigation from "constants/navigation/siteAppNavigation";
import { getSiteApplicationDetail } from "services/clients/sites/siteApplications/siteApplicationDetails";

const SingleComponent = (route) => {
	const location = useLocation();
	const siteAppIds = useParams();
	const { clientId, id, appId } = siteAppIds;
	const [state, dispatch] = useContext(SiteContext);

	const navigation = SiteApplicationNavigation(clientId, id, appId);

	const openAddModal = () => dispatch({ type: "ADD_TOGGLE" });

	const openConfirmationModal = () =>
		dispatch({ type: "TOGGLE_CONFIRMATION_MODAL", payload: true });

	const fetchSiteApplicationDetails = async () => {
		const result = await getSiteApplicationDetail(appId);

		dispatch({
			type: "SET_SITE_APP_DETAIL",
			payload: result,
		});

		dispatch({
			type: "TOGGLE_ISACTIVE",
			payload: result.data.isActive,
		});
	};

	useEffect(() => {
		if (location.pathname.split("/")[7] === "detail") {
			fetchSiteApplicationDetails();
		}

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<div className="container">
			<CommonHeaderWrapper
				crumbs={["Clients", "Site", "Application"]}
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
	);
};

export default SingleComponent;
