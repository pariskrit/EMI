import React from "react";
import SiteApplicationContext from "contexts/SiteApplicationContext";
import {
	siteApplicationPath,
	siteApplicationPathCustomCaptions,
	siteApplicationPausePath,
	siteApplicationPathStopsReasons,
	siteApplicationPathSkippedTasks,
	siteApplicationPathMissingItems,
	siteApplicationPathStatusChanges,
} from "helpers/routePaths";
import CustomCaptions from "pages/Clients/Sites/SiteApplication/CustomCaptions";
import { Route } from "react-router-dom";
import SiteApplication from "..";
import SiteApplicationDetails from "../SiteApplicationDetails";
import SiteAppPauses from "../SiteAppPauses";
import SingleComponent from "./SingleComponent";
import SingleColumnTableCommonComponent from "components/Modules/SingleColumnTableCommonComponent";

//New Added
import differentAPIs from "helpers/differentAPIs";

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
		name: "Details",
		path: siteApplicationPathCustomCaptions,
		component: CustomCaptions,
		showAdd: false,
		showHistory: true,
		showSwitch: false,
	},

	{
		id: 62,
		name: "Reason Definitions",
		path: siteApplicationPathStopsReasons,
		component: SingleColumnTableCommonComponent,
		showAdd: true,
		showHistory: true,
		showSwitch: false,
		header: "Stop Reasons",
		api: differentAPIs.StopReasonsAPIs,
	},
	{
		id: 61,
		name: "Reason Definitions",
		path: siteApplicationPathSkippedTasks,
		component: SingleColumnTableCommonComponent,
		showAdd: true,
		showHistory: true,
		showSwitch: false,
		header: "Skipped Tasks",
		api: differentAPIs.SkippedTasksAPIs,
	},
	{
		id: 58,
		name: "Reason Definitions",
		path: siteApplicationPathMissingItems,
		component: SingleColumnTableCommonComponent,
		showAdd: true,
		showHistory: true,
		showSwitch: false,
		header: "Missing Part or Tool Reasons",
		api: differentAPIs.MissingPartAPIs,
	},
	{
		id: 50,
		name: "Reason Definitions",
		path: siteApplicationPathStatusChanges,
		component: SingleColumnTableCommonComponent,
		showAdd: true,
		showHistory: true,
		showSwitch: false,
		header: "Status Changes",
		api: differentAPIs.StatusChangesAPIs,
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
