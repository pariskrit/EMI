import { siteApplicationPath } from "helpers/routePaths";
import React from "react";
import { Route } from "react-router";
import SiteApplication from "..";
import SiteApplicationDetails from "../SiteApplicationDetails";

function SiteAppPage() {
	return (
		<SiteApplication>
			<Route path={siteApplicationPath} exact>
				<SiteApplicationDetails />
			</Route>
		</SiteApplication>
	);
}

export default SiteAppPage;
