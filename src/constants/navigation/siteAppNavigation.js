import {
	clientsPath,
	siteAppCustomCaptionsPath,
	siteAppMissingItemsPath,
	siteAppModelStatusesPath,
	siteAppModelTypesPath,
	siteAppOperationModesPath,
	siteAppFeedbackClassificationsPath,
	siteAppPausePath,
	siteAppSkippedTasksPath,
	siteAppStatusChangesPath,
	siteAppStopsReasonsPath,
	siteAppTaskActionsPath,
	siteAppTaskSystemsPath,
	siteAppLubricantsPath,
	siteAppDefectTypesPath,
	siteAppFeedbackPrioritiesPath,
	siteAppUserRolesPath,
	siteAppDefectRiskRatingsPath,
	siteAppDefectStatusPath,
	siteAppDetailPath,
	siteAppPositionsPath,
	siteAppFeedbackStatuses,
} from "helpers/routePaths";

/**
 * NOTE: This is currently a helper. In production, this data may come from either the API
 * or can be hard coded. Probably not approproate as a helper function
 */
const SiteApplicationNavigation = (
	clientId,
	siteId,
	appId,
	data,
	defaultCustom
) => {
	// Setting navigation links with correct application ID
	const links = `${clientsPath}/${clientId}/sites/${siteId}/applications/${appId}`;
	const navigation = [
		{
			name: "Details",
			main: "Details",
			dropdown: [
				{
					title: "Application",
					link: links + siteAppDetailPath,
				},
				{
					title: "Custom Captions",
					link: links + siteAppCustomCaptionsPath,
				},
			],
		},
		{
			name: "Reason Definitions",
			main: "Reason Definitions",
			dropdown: [
				{
					title: data?.pauseReasonPluralCC || defaultCustom.pauseReasonPlural,
					link: links + siteAppPausePath,
				},
				{
					title: data?.stopReasonPluralCC || defaultCustom.stopReasonPlural,
					link: links + siteAppStopsReasonsPath,
				},
				{
					title: data?.skipReasonPluralCC || defaultCustom.skipReasonPlural,
					link: links + siteAppSkippedTasksPath,
				},
				{
					title: `Missing ${data?.partCC || defaultCustom.part} or ${
						data?.toolPluralCC || defaultCustom.toolPlural
					}`,
					link: links + siteAppMissingItemsPath,
				},
				{
					title: "Status Changes",
					link: links + siteAppStatusChangesPath,
				},
			],
		},
		{
			name: `${data?.modelCC || defaultCustom?.model} Definitions`,
			main: "Model Definitions",
			dropdown: [
				{
					title: "Statuses",
					link: links + siteAppModelStatusesPath,
				},
				{
					title: data?.modelTypePluralCC || defaultCustom.modelTypePlural,
					link: links + siteAppModelTypesPath,
				},
			],
		},
		{
			name: `${data?.taskCC || defaultCustom?.task} Definitions`,
			main: "Task Definitions",
			dropdown: [
				{
					title:
						data?.actionRequiredPluralCC || defaultCustom.actionRequiredPlural,
					link: links + siteAppTaskActionsPath,
				},
				{
					title: data?.systemPluralCC || defaultCustom.systemPlural,
					link: links + siteAppTaskSystemsPath,
				},
				{
					title:
						data?.operatingModePluralCC || defaultCustom.operatingModePlural,
					link: links + siteAppOperationModesPath,
				},
				{
					title: data?.lubricantPluralCC || defaultCustom.lubricantPlural,
					link: links + siteAppLubricantsPath,
				},
			],
		},
		{
			name: `${data?.userCC || defaultCustom?.user} Definitions`,
			main: "User Definitions",
			dropdown: [
				{
					title: data?.positionPluralCC || defaultCustom.positionPlural,
					link: links + siteAppPositionsPath,
				},
				{
					title: data?.rolePluralCC || defaultCustom.rolePlural,
					link: links + siteAppUserRolesPath,
				},
			],
		},
		{
			name: `${data?.defectCC || defaultCustom?.defect} Definitions`,
			main: "Defect Definitions",
			dropdown: [
				{
					title: data?.riskRatingPluralCC || defaultCustom.riskRatingPlural,
					link: links + siteAppDefectRiskRatingsPath,
				},
				{
					title: data?.defectStatusPluralCC || defaultCustom.defectStatusPlural,
					link: links + siteAppDefectStatusPath,
				},
				{
					title: data?.defectTypePluralCC || defaultCustom.defectTypePlural,
					link: links + siteAppDefectTypesPath,
				},
			],
		},
		{
			name: `${data?.feedbackCC || defaultCustom.feedback} Definitions`,
			main: "Feedback Definitions",
			dropdown: [
				{
					title:
						data?.classificationPluralCC || defaultCustom.classificationPlural,
					link: links + siteAppFeedbackClassificationsPath,
				},
				{
					title: data?.priorityPluralCC || defaultCustom.priorityPlural,
					link: links + siteAppFeedbackPrioritiesPath,
				},
				{
					title:
						data?.feedbackStatusPluralCC || defaultCustom.feedbackStatusPlural,
					link: links + siteAppFeedbackStatuses,
				},
			],
		},
	];

	return navigation;
};

export default SiteApplicationNavigation;
