import React from "react";
import { Route } from "react-router-dom";
import SiteApplication from "..";
import SiteAppPauses from "../SiteAppPauses";
import { siteApplicationPausePath } from "helpers/routePaths";

const SiteAppPage = () => {
	return (
		<SiteApplication>
			<Route path={siteApplicationPausePath} exact>
				<SiteAppPauses />
			</Route>
		</SiteApplication>
	);
};

export default SiteAppPage;
