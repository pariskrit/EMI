import React from "react";
import roles from "helpers/roles";
import SingleColumnTableCommonComponent from "components/Modules/SingleColumnTableCommonComponent";
import SiteApplicationContext from "contexts/SiteApplicationContext";
import differentAPIs from "helpers/differentAPIs";
import {
	siteAppCustomCaptionsPath,
	siteAppDefectStatusPath,
	siteAppDefectTypesPath,
	siteAppDetailPath,
	siteAppFeedbackClassificationsPath,
	siteAppFeedbackPrioritiesPath,
	siteAppFeedbackStatuses,
	siteAppLubricantsPath,
	siteAppMissingItemsPath,
	siteAppModelStatusesPath,
	siteAppModelTypesPath,
	siteAppPath,
	siteAppOperationModesPath,
	siteAppPausePath,
	siteAppPositionsPath,
	siteAppSkippedTasksPath,
	siteAppStatusChangesPath,
	siteAppStopsReasonsPath,
	siteAppTaskActionsPath,
	siteAppTaskSystemsPath,
	siteAppUserRolesPath,
	siteAppDefectRiskRatingsPath,
} from "helpers/routePaths";
import CustomCaptions from "pages/Clients/Sites/SiteApplication/CustomCaptions";
import SiteApplication from "..";
import SiteAppFeedbackStatuses from "../SiteAppFeedbackStatuses";
import SiteApplicationDetails from "../SiteApplicationDetails";
import SiteAppModelStatuses from "../SiteAppModelStatuses";
import SiteAppPauses from "../SiteAppPauses";
import SingleComponent from "./SingleComponent";
import UserRoles from "../UserRoles";
import DefectStatuses from "../DefectStatuses";
import DefectRiskRatings from "../DefectRiskRatings";
import UserPositions from "../UserPositions";
import { RoleRoutes } from "components/HOC/RoleRoute";
import { Switch } from "react-router-dom";
import { Route } from "react-router-dom/cjs/react-router-dom.min";

const route = (customCaption) => {
	return [
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
			singleCaption: { main: "stopReasonCC", default: "stopReason" },
			pluralCaption: {
				main: "stopReasonPluralCC",
				default: "stopReasonPlural",
			},
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
			singleCaption: { main: "skipReasonCC", default: "skipReason" },
			pluralCaption: {
				main: "skipReasonPluralCC",
				default: "skipReasonPlural",
			},
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
			isMissingPartOrTools: true,
			singleCaption: {
				part: "partCC",
				defaultPart: "part",
				tool: "toolCC",
				default: "tool",
			},
			pluralCaption: {
				tool: "toolPluralCC",
				defaultTool: "toolPlural",
				default: "tool",
			},
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
			singleCaption: { main: "statusChangeCC", default: "statusChange" },
			pluralCaption: {
				main: "statusChangePluralCC",
				default: "statusChangePlural",
			},
			api: differentAPIs.StatusChangesAPIs,
		},
		{
			id: 48,
			name: `${customCaption?.model} Definitions`,
			path: siteAppModelStatusesPath,
			component: SiteAppModelStatuses,
			showAdd: true,
			showHistory: true,
			showSwitch: false,
		},
		{
			id: 49,
			name: `${customCaption?.model} Definitions`,
			path: siteAppModelTypesPath,
			component: SingleColumnTableCommonComponent,
			showAdd: true,
			showHistory: true,
			showSwitch: false,
			singleCaption: { main: "modelTypeCC", default: "modelType" },
			pluralCaption: {
				main: "modelTypePluralCC",
				default: "modelTypePlural",
			},
			api: differentAPIs.ModelTypesAPIs,
		},

		{
			id: 59,
			name: `${customCaption?.task} Definitions`,
			path: siteAppOperationModesPath,
			component: SingleColumnTableCommonComponent,
			showAdd: true,
			showHistory: false,
			showSwitch: false,
			singleCaption: { main: "operatingModeCC", default: "operatingMode" },
			pluralCaption: {
				main: "operatingModePluralCC",
				default: "operatingModePlural",
			},
			api: differentAPIs.OperatingModesAPIs,
			pathToPatch: "defaultOperatingModeID",
			showDefault: true,
		},
		{
			id: 55,
			name: `${customCaption?.feedback} Definitions`,
			path: siteAppFeedbackClassificationsPath,
			component: SingleColumnTableCommonComponent,
			showAdd: true,
			showHistory: true,
			showSwitch: false,
			singleCaption: { main: "classificationCC", default: "classification" },
			pluralCaption: {
				main: "classificationPluralCC",
				default: "classificationPlural",
			},
			api: differentAPIs.FeedbackClassificationsAPIs,
			showDefault: true,
			pathToPatch: "defaultFeedbackClassificationID",
		},
		{
			id: 57,
			name: `${customCaption?.feedback} Definitions`,
			path: siteAppFeedbackStatuses,
			component: SiteAppFeedbackStatuses,
			showAdd: true,
			showSwitch: false,
			header: "Feedback Statuses",
		},
		{
			id: 47,
			name: `${customCaption?.task} Definitions`,
			path: siteAppTaskActionsPath,
			component: SingleColumnTableCommonComponent,
			showAdd: true,
			showHistory: true,
			showSwitch: false,
			singleCaption: { main: "actionRequiredCC", default: "actionRequired" },
			pluralCaption: {
				main: "actionRequired",
				default: "actionRequiredPlural",
			},
			api: differentAPIs.ActionsAPIs,
		},
		{
			id: 63,
			name: `${customCaption?.task} Definitions`,
			path: siteAppTaskSystemsPath,
			component: SingleColumnTableCommonComponent,
			showAdd: true,
			showHistory: true,
			showSwitch: false,
			singleCaption: { main: "systemCC", default: "system" },
			pluralCaption: {
				main: "systemPluralCC",
				default: "systemPlural",
			},
			api: differentAPIs.SystemsAPIs,
		},
		{
			id: 64,
			name: `${customCaption?.task} Definitions`,
			path: siteAppLubricantsPath,
			component: SingleColumnTableCommonComponent,
			showAdd: true,
			showHistory: true,
			showSwitch: false,
			singleCaption: { main: "lubricantCC", default: "lubricant" },
			pluralCaption: { main: "lubricantPluralCC", default: "lubricantPlural" },
			api: differentAPIs.LubricantsAPIs,
		},
		{
			id: 54,
			name: `${customCaption?.defect} Definitions`,
			path: siteAppDefectTypesPath,
			component: SingleColumnTableCommonComponent,
			showAdd: true,
			showHistory: true,
			showSwitch: false,
			singleCaption: { main: "defectTypeCC", default: "defectType" },
			pluralCaption: {
				main: "defectTypePluralCC",
				default: "defectTypePlural",
			},
			api: differentAPIs.DefectTypesAPIs,
		},
		{
			id: 56,
			name: `${customCaption?.feedback} Definitions`,
			path: siteAppFeedbackPrioritiesPath,
			component: SingleColumnTableCommonComponent,
			showAdd: true,
			showHistory: true,
			showSwitch: false,
			singleCaption: { main: "priorityCC", default: "priority" },
			pluralCaption: {
				main: "priorityPluralCC",
				default: "priorityPlural",
			},
			api: differentAPIs.FeedbackPrioritiesAPIs,
			showDefault: true,
			pathToPatch: "defaultFeedbackPriorityID",
		},
		{
			id: 60,
			name: `${customCaption?.user} Definitions`,
			path: siteAppUserRolesPath,
			component: UserRoles,
			showAdd: true,
			showHistory: true,
			showSwitch: false,
		},
		{
			id: 53,
			name: `${customCaption?.defect} Definitions`,
			path: siteAppDefectStatusPath,
			component: DefectStatuses,
			showAdd: true,
			showHistory: false,
			showSwitch: false,
		},
		{
			id: 52,
			name: `${customCaption?.defect} Definitions`,
			path: siteAppDefectRiskRatingsPath,
			component: DefectRiskRatings,
			showHistory: true,
			showSwitch: false,
			showAdd: true,
		},
		{
			id: 109,
			name: `${customCaption?.user} Definitions`,
			path: siteAppPositionsPath,
			component: UserPositions,
			showAdd: true,
			showHistory: false,
			showSwitch: false,
		},
	];
};

const SiteAppPage = () => {
	return (
		<Route path={siteAppPath}>
			<SiteApplicationContext>
				<SiteApplication>
					{(customCaption) => (
						<Switch>
							{route(customCaption).map((route) => (
								<RoleRoutes
									component={SingleComponent}
									key={route.id}
									path={siteAppPath + route.path}
									exact
									roles={[roles.superAdmin, roles.siteUser, roles.clientAdmin]}
									routeInfo={route}
								/>
							))}
						</Switch>
					)}
				</SiteApplication>
			</SiteApplicationContext>
		</Route>
	);
};

export default SiteAppPage;
