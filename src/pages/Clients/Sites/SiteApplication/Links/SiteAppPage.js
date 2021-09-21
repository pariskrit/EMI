import React from "react";
import SiteApplicationContext from "contexts/SiteApplicationContext";
import {
	siteApplicationPath,
	siteApplicationPathCustomCaptions,
	siteApplicationPausePath,
	siteApplicationPathStopsReasons,
	sitApplicationPathModelStatuses,
} from "helpers/routePaths";
import CustomCaptions from "pages/Clients/Sites/SiteApplication/CustomCaptions";
import { Route } from "react-router-dom";
import SiteApplication from "..";
import SiteApplicationDetails from "../SiteApplicationDetails";
import SiteAppPauses from "../SiteAppPauses";
import SiteAppStopsReasons from "../StopReasons";
import SingleComponent from "./SingleComponent";
import SiteAppModelStatuses from "../SiteAppModelStatuses";

const routes = [
	{
		id: 46,
		name: "Details",
		path: siteApplicationPath,
		component: SiteApplicationDetails,
		showAdd: false,
		showHistory: true,
		showSwitch: true,
	},
	{
		id: 108,
		name: "Reason Definitions",
		path: siteApplicationPausePath,
		component: SiteAppPauses,
		showAdd: true,
		showHistory: true,
		showSwitch: false,
	},
	{
		id: 51,
		name: "Details",
		path: siteApplicationPathCustomCaptions,
		component: CustomCaptions,
		showAdd: true,
		showHistory: true,
		showSwitch: false,
	},
	{
		id: 48,
		name: "Model Definitions",
		path: sitApplicationPathModelStatuses,
		component: SiteAppModelStatuses,
		showAdd: true,
		showHistory: true,
		showSwitch: false,
	},
];

const SiteAppPage = () => {
	return (
		<SiteApplicationContext>
			<SiteApplication>
				{routes.map((route) => (
					<Route key={route.id} path={route.path} exact>
						<SingleComponent {...route} />
					</Route>
				))}
			</SiteApplication>
		</SiteApplicationContext>
	);
};

export default SiteAppPage;
