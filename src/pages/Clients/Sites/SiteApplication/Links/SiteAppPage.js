import React from "react";
import { Route } from "react-router-dom";
import SiteApplication from "..";
import SiteAppPauses from "../SiteAppPauses";
import {
	siteApplicationPathCustomCaptions,
	siteApplicationPausePath,
} from "helpers/routePaths";
import CustomCaptions from "pages/Clients/Sites/SiteApplication/CustomCaptions";

const SiteAppPage = () => {
	return (
		<SiteApplication>
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
