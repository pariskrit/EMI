import {
	siteApplicationPath,
	siteApplicationPathCustomCaptions,
	siteApplicationPausePath,
	siteApplicationPathStopsReasons,
} from "helpers/routePaths";
import CustomCaptions from "pages/Clients/Sites/SiteApplication/CustomCaptions";
import React from "react";
import { Route } from "react-router-dom";
import SiteApplication from "..";
import SiteApplicationDetails from "../SiteApplicationDetails";
import SiteAppPauses from "../SiteAppPauses";
import SiteAppStopsReasons from "../StopReasons";

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
			<Route path={siteApplicationPathStopsReasons} exact>
				<SiteAppStopsReasons />
			</Route>
		</SiteApplication>
	);
};

export default SiteAppPage;
