import React, { useContext } from "react";
import { SiteContext } from "contexts/SiteApplicationContext";
import { useParams, useLocation } from "react-router";
import CommonHeaderWrapper from "components/Modules/CommonHeaderWrapper";
import SiteApplicationNavigation from "constants/navigation/siteAppNavigation";

const SingleComponent = (route) => {
	const location = useLocation();
	const siteAppIds = useParams();
	const { clientId, id, appId } = siteAppIds;
	const [state, dispatch] = useContext(SiteContext);

	const navigation = SiteApplicationNavigation(clientId, id, appId);

	return (
		<>
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
				onClickAdd={() => dispatch({ type: "ADD_TOGGLE", payload: true })}
				showSwitch={route.showSwitch}
				handlePatchIsActive={() => {}}
				showHistory={route.showHistory}
			/>
			{
				<route.component
					state={state}
					dispatch={dispatch}
					siteAppIds={siteAppIds}
				/>
			}
		</>
	);
};

export default SingleComponent;
