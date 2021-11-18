import React from "react";
import Portal from "./Portal";
import { Route } from "react-router-dom";
import { applicationPortalPath } from "helpers/routePaths";

function ApplicationPortal() {
	return (
		<Route path={applicationPortalPath} exact>
			<Portal />
		</Route>
	);
}

export default ApplicationPortal;
