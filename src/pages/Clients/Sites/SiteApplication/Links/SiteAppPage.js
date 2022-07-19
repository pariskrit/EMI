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
import RoleRoute from "components/HOC/RoleRoute";

const { customCaptions } = JSON.parse(localStorage?.getItem("me"));

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
		singleCaption: { main: "stopReasonCC", default: "stopReason" },
		pluralCaption: { main: "stopReasonPluralCC", default: "stopReasonPlural" },
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
		pluralCaption: { main: "skipReasonPluralCC", default: "skipReasonPlural" },
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
			defaultTool: "tool",
		},
		pluralCaption: {
			tool: "toolPluralCC",
			defaultTool: "toolPlural",
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
		name: `${customCaptions?.model} Definitions`,
		path: siteAppModelStatusesPath,
		component: SiteAppModelStatuses,
		showAdd: true,
		showHistory: true,
		showSwitch: false,
	},
	{
		id: 49,
		name: `${customCaptions?.model} Definitions`,
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
		name: `${customCaptions?.task} Definitions`,
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
		name: `${customCaptions?.feedback} Definitions`,
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
		name: `${customCaptions?.feedback} Definitions`,
		path: siteAppFeedbackStatuses,
		component: SiteAppFeedbackStatuses,
		showAdd: true,
		showSwitch: false,
		header: "Feedback Statuses",
	},
	{
		id: 47,
		name: `${customCaptions?.task} Definitions`,
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
		name: `${customCaptions?.task} Definitions`,
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
		name: `${customCaptions?.task} Definitions`,
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
		name: `${customCaptions?.defect} Definitions`,
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
		name: `${customCaptions?.feedback} Definitions`,
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
		name: `${customCaptions?.user} Definitions`,
		path: siteAppUserRolesPath,
		component: UserRoles,
		showAdd: true,
		showHistory: true,
		showSwitch: false,
	},
	{
		id: 53,
		name: `${customCaptions?.defect} Definitions`,
		path: siteAppDefectStatusPath,
		component: DefectStatuses,
		showAdd: true,
		showHistory: false,
		showSwitch: false,
	},
	{
		id: 52,
		name: `${customCaptions?.defect} Definitions`,
		path: siteAppDefectRiskRatingsPath,
		component: DefectRiskRatings,
		showHistory: true,
		showSwitch: false,
		showAdd: true,
	},
	{
		id: 109,
		name: `${customCaptions?.user} Definitions`,
		path: siteAppPositionsPath,
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
					<RoleRoute
						component={(props) => <SingleComponent {...route} {...props} />}
						key={route.id}
						path={siteAppPath + route.path}
						exact
						roles={[roles.superAdmin, roles.siteUser, roles.clientAdmin]}
					/>
				))}
			</SiteApplication>
		</SiteApplicationContext>
	);
};

export default SiteAppPage;
