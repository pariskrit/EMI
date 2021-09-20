import React from "react";
import SiteApplicationContext from "contexts/SiteApplicationContext";
import {
	siteApplicationPath,
	siteApplicationPathCustomCaptions,
	siteApplicationPausePath,
} from "helpers/routePaths";
import CustomCaptions from "pages/Clients/Sites/SiteApplication/CustomCaptions";
import { Route } from "react-router-dom";
import SiteApplication from "..";
import SiteApplicationDetails from "../SiteApplicationDetails";
import SiteAppPauses from "../SiteAppPauses";
import SingleComponent from "./SingleComponent";

const routes = [
	{
		id: 1,
		name: "Details",
		path: siteApplicationPath,
		component: SiteApplicationDetails,
		showAdd: false,
		showHistory: true,
		showSwitch: true,
	},
	{
		id: 2,
		name: "Reason Definitions",
		path: siteApplicationPausePath,
		component: SiteAppPauses,
		showAdd: true,
		showHistory: true,
		showSwitch: false,
	},
	{
		id: 3,
		path: siteApplicationPathCustomCaptions,
		component: CustomCaptions,
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
				{/* <Route path={siteApplicationPath} exact>
					<SiteApplicationDetails />
				</Route>
				<Route path={siteApplicationPausePath} exact>
					<SiteAppPauses />
				</Route>
				<Route path={siteApplicationPathCustomCaptions} exact>
					<CustomCaptions />
				</Route> */}
			</SiteApplication>
		</SiteApplicationContext>
	);
};

export default SiteAppPage;
