import {
	clientsPath,
	siteAppCustomCaptionsPath,
	siteAppMissingItemsPath,
	siteAppModelStatusesPath,
	siteAppModelTypesPath,
	siteAppOperationModesPath,
	siteAppPausePath,
	siteAppSkippedTasksPath,
	siteAppStatusChangesPath,
	siteAppStopsReasonsPath,
	siteAppTaskActionsPath,
	siteAppTaskSystemsPath,
	siteAppLubricantsPath,
	siteAppDefectTypesPath,
	siteAppFeedbackClassificationsPath,
	siteAppFeedbackPrioritiesPath,
	siteAppUserRolesPath,
} from "helpers/routePaths";

/**
 * NOTE: This is currently a helper. In production, this data may come from either the API
 * or can be hard coded. Probably not approproate as a helper function
 */
const SiteApplicationNavigation = (clientId, siteId, appId) => {
	// Setting navigation links with correct application ID
	const links = `${clientsPath}/${clientId}/sites/${siteId}/applications/${appId}`;
	const navigation = [
		{
			name: "Details",
			dropdown: [
				{
					title: "Application",
					link: links,
				},
				{
					title: "Custom Captions",
					link: links + siteAppCustomCaptionsPath,
				},
			],
		},
		{
			name: "Reason Definitions",
			dropdown: [
				{
					title: "Pauses",
					link: links + siteAppPausePath,
				},
				{
					title: "Stops",
					link: links + siteAppStopsReasonsPath,
				},
				{
					title: "Skipped Tasks",
					link: links + siteAppSkippedTasksPath,
				},
				{
					title: "Missing Part or Tools",
					link: links + siteAppMissingItemsPath,
				},
				{
					title: "Status Changes",
					link: links + siteAppStatusChangesPath,
				},
			],
		},
		{
			name: "Model Definitions",
			dropdown: [
				{
					title: "Statuses",
					link: links + siteAppModelStatusesPath,
				},
				{
					title: "Types",
					link: links + siteAppModelTypesPath,
				},
			],
		},
		{
			name: "Task Definitions",
			dropdown: [
				{
					title: "Actions",
					link: links + siteAppTaskActionsPath,
				},
				{
					title: "Systems",
					link: links + siteAppTaskSystemsPath,
				},
				{
					title: "Operating Modes",
					link: links + siteAppOperationModesPath,
				},
				{
					title: "Lubricants",
					link: links + siteAppLubricantsPath,
				},
			],
		},
		{
			name: "User Definitions",
			dropdown: [
				{
					title: "Positions",
					link: links + "positions",
				},
				{
					title: "Roles",
					link: links + siteAppUserRolesPath,
				},
			],
		},
		{
			name: "Defect Definitions",
			dropdown: [
				{
					title: "Risk Ratings",
					link: links + "defectriskratings",
				},
				{
					title: "Statuses",
					link: links + "defectstatuses",
				},
				{
					title: "Types",
					link: links + siteAppDefectTypesPath,
				},
			],
		},
		{
			name: "Feedback Definitions",
			dropdown: [
				{
					title: "Classifications",
					link: links + siteAppFeedbackClassificationsPath,
				},
				{
					title: "Priorities",
					link: links + siteAppFeedbackPrioritiesPath,
				},
				{
					title: "Statuses",
					link: links + "feedbackstatuses",
				},
			],
		},
	];

	return navigation;
};

export default SiteApplicationNavigation;
