import SingleColumnTableCommonComponent from "components/Modules/SingleColumnTableCommonComponent";
import SiteApplicationContext from "contexts/SiteApplicationContext";
import differentAPIs from "helpers/differentAPIs";
import {
	siteAppCustomCaptionsPath,
	siteAppDetailPath,
	siteAppMissingItemsPath,
	siteAppModelStatusesPath,
	siteAppModelTypesPath,
	siteAppPath,
	siteAppOperationModesPath,
	siteAppPausePath,
	siteAppSkippedTasksPath,
	siteAppStatusChangesPath,
	siteAppStopsReasonsPath,
	siteAppFeedbackClassificationsPath,
	siteAppTaskActions,
	siteAppTaskSystems,
	siteAppLubricants,
	siteAppDefectTypes,
	siteAppDefectStatusPath,
} from "helpers/routePaths";

import CustomCaptions from "pages/Clients/Sites/SiteApplication/CustomCaptions";
import React from "react";
import { Route } from "react-router-dom";
import SiteApplication from "..";
import OperatingModes from "../OperatingModes";
import SiteApplicationDetails from "../SiteApplicationDetails";
import SiteAppModelStatuses from "../SiteAppModelStatuses";
import SiteAppPauses from "../SiteAppPauses";
import SingleComponent from "./SingleComponent";
import DefectStatuses from "../DefectStatuses";

const routes = [
	{
		id: 46,
		name: "Details",
		path: siteAppDetailPath,
		component: SiteApplicationDetails,
		showAdd: false,
		showHistory: true,
		showSwitch: true,
	},
	{
		id: 108,
		name: "Reason Definitions",
		path: siteAppPausePath,
		component: SiteAppPauses,
		showAdd: true,
		showHistory: true,
		showSwitch: false,
	},
	{
		id: 51,
		name: "Details",
		path: siteAppCustomCaptionsPath,
		component: CustomCaptions,
		showAdd: false,
		showHistory: true,
		showSwitch: false,
	},

	{
		id: 62,
		name: "Reason Definitions",
		path: siteAppStopsReasonsPath,
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
		path: siteAppSkippedTasksPath,
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
		path: siteAppMissingItemsPath,
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
		path: siteAppStatusChangesPath,
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
		path: siteAppModelStatusesPath,
		component: SiteAppModelStatuses,
		showAdd: true,
		showHistory: true,
		showSwitch: false,
	},
	{
		id: 49,
		name: "Model Definitions",
		path: siteAppModelTypesPath,
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
		path: siteAppOperationModesPath,
		component: OperatingModes,
		showAdd: true,
		showHistory: false,
		showSwitch: false,
	},
	{
		id: 55,
		name: "Feedback Definitions",
		path: siteAppFeedbackClassificationsPath,
		component: SingleColumnTableCommonComponent,
		showAdd: true,
		showHistory: true,
		showSwitch: false,
		header: "Feedback Classifications",
		api: differentAPIs.FeedbackClassificationsAPIs,
		showDefault: true,
		pathToPatch: "defaultFeedbackClassificationID",
	},
	{
		id: 47,
		name: "Task Definitions",
		path: siteAppTaskActions,
		component: SingleColumnTableCommonComponent,
		showAdd: true,
		showHistory: true,
		showSwitch: false,
		header: "Action",
		api: differentAPIs.ActionsAPIs,
	},
	{
		id: 63,
		name: "Task Definitions",
		path: siteAppTaskSystems,
		component: SingleColumnTableCommonComponent,
		showAdd: true,
		showHistory: true,
		showSwitch: false,
		header: "Action",
		api: differentAPIs.SystemsAPIs,
	},
	{
		id: 64,
		name: "Task Definitions",
		path: siteAppLubricants,
		component: SingleColumnTableCommonComponent,
		showAdd: true,
		showHistory: true,
		showSwitch: false,
		header: "Lubricants",
		api: differentAPIs.LubricantsAPIs,
	},
	{
		id: 54,
		name: "Defect Definitions",
		path: siteAppDefectTypes,
		component: SingleColumnTableCommonComponent,
		showAdd: true,
		showHistory: true,
		showSwitch: false,
		header: "Defect Types",
		api: differentAPIs.DefectTypesAPIs,
	},
	{
		id: 53,
		name: "Defect Definitions",
		path: siteAppDefectStatusPath,
		component: DefectStatuses,
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
					<Route key={route.id} path={siteAppPath + route.path} exact>
						<SingleComponent {...route} />
					</Route>
				))}
			</SiteApplication>
		</SiteApplicationContext>
	);
};

export default SiteAppPage;
