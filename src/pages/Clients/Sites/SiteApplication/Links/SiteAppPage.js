import {
	siteApplicationPath,
	siteApplicationPathCustomCaptions,
	siteApplicationPausePath,
} from "helpers/routePaths";
import CustomCaptions from "pages/Clients/Sites/SiteApplication/CustomCaptions";
import React from "react";
import { Route } from "react-router-dom";
import SiteApplication from "..";
import SiteApplicationDetails from "../SiteApplicationDetails";
import SiteAppPauses from "../SiteAppPauses";

const SiteAppPage = () => {
	return (
		<SiteApplication>
			<Route path={siteApplicationPath} exact>
				<SiteApplicationDetails />
			</Route>
			<Route path={siteApplicationPausePath} exact>
				<SiteAppPauses />
			</Route>
			<Route path={siteApplicationPathCustomCaptions} exact>
				<CustomCaptions />
			</Route>
		</SiteApplication>
	);
};

export default SiteAppPage;
