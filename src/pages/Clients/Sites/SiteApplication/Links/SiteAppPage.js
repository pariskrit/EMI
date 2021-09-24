import React from "react";
import SiteApplicationContext from "contexts/SiteApplicationContext";
import {
	siteApplicationPath,
	siteApplicationPathCustomCaptions,
	siteApplicationPausePath,
	siteApplicationOperationModesPath,
	siteApplicationPathStopsReasons,
	sitApplicationPathModelStatuses,
	siteApplicationPathModelTypes,
	siteApplicationPathSkippedTasks,
	siteApplicationPathMissingItems,
	siteApplicationPathStatusChanges,
	siteApplicationPathDefectStatus,
	siteApplicationPathUserPositions,
} from "helpers/routePaths";
import CustomCaptions from "pages/Clients/Sites/SiteApplication/CustomCaptions";
import { Route } from "react-router-dom";
import SiteApplication from "..";
import SiteApplicationDetails from "../SiteApplicationDetails";
import SiteAppPauses from "../SiteAppPauses";
import SingleComponent from "./SingleComponent";
import OperatingModes from "../OperatingModes";
import SiteAppModelStatuses from "../SiteAppModelStatuses";
import SingleColumnTableCommonComponent from "components/Modules/SingleColumnTableCommonComponent";

//New Added
import differentAPIs from "helpers/differentAPIs";
import DefectStatuses from "../DefectStatuses";
import UserPositions from "../UserPositions";

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
	{
		id: 48,
		name: "Model Definitions",
		path: sitApplicationPathModelStatuses,
		component: SiteAppModelStatuses,
		showAdd: true,
		showHistory: true,
		showSwitch: false,
	},
	{
		id: 49,
		name: "Model Definitions",
		path: siteApplicationPathModelTypes,
		component: SingleColumnTableCommonComponent,
		showAdd: true,
		showHistory: true,
		showSwitch: false,
		header: "Model Types",
		api: differentAPIs.ModelTypesAPIs,
	},
	{
		id: 59,
		name: "Task Definitions",
		path: siteApplicationOperationModesPath,
		component: OperatingModes,
		showAdd: true,
		showHistory: false,
		showSwitch: false,
	},
	{
		id: 53,
		name: "Defect Definitions",
		path: siteApplicationPathDefectStatus,
		component: DefectStatuses,
		showAdd: true,
		showHistory: false,
		showSwitch: false,
	},
	{
		id: 109,
		name: "User Definitions",
		path: siteApplicationPathUserPositions,
		component: UserPositions,
		showAdd: true,
		showHistory: false,
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
