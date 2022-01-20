import React from "react";
import Portal from "./Portal";
import { Route, useHistory } from "react-router-dom";
import { applicationPortalPath } from "helpers/routePaths";

function ApplicationPortal() {
	const history = useHistory();
	return (
		<Route
			path={applicationPortalPath}
			exact
			render={(props) => {
				const { position, multiSiteUser } =
					JSON.parse(sessionStorage.getItem("me")) ||
					JSON.parse(localStorage.getItem("me"));
				if (position === null || multiSiteUser === true)
					return <Portal {...props} />;
				else {
					history.length > 1 ? history.goBack() : history.push("/app/me");
				}
			}}
		/>
	);
}

export default ApplicationPortal;
