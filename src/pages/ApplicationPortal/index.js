import React from "react";
import Portal from "./Portal";
import { Route, useNavigate } from "react-router-dom";
import { applicationPortalPath } from "helpers/routePaths";

function ApplicationPortal() {
	const navigate = useNavigate();
	return (
		<Route
			path={applicationPortalPath}
			exact
			element={<Portal />}
			// element={(props) => {
			// 	const { position, multiSiteUser } =
			// 		JSON.parse(sessionStorage.getItem("me")) ||
			// 		JSON.parse(localStorage.getItem("me"));
			// 	if (position === null || multiSiteUser === true)
			// 		return <Portal {...props} />;
			// 	else {
			// 		window.history.length > 1 ? navigate(-1) : navigate("/app/me");
			// 	}
			// }}
		/>
	);
}

export default ApplicationPortal;
