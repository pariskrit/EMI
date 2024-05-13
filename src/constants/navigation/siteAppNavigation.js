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
	appPath,
} from "helpers/routePaths";

import roles from "helpers/roles";

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
	//application modal nav-dropdown states
	const showLubricants = data?.application?.showLubricants;
	const showSystem = data?.application?.showSystem;
	const showOperations = data?.application?.showOperatingMode;
	// Setting navigation links with correct application ID
	const links = `${appPath}${clientsPath}/${clientId}/sites/${siteId}/applications/${appId}/`;
	const taskDefList = [
		{
			title: data?.actionRequiredPluralCC || defaultCustom.actionRequiredPlural,
			link: links + siteAppTaskActionsPath,
		},
	];
	//add data only if its state is true
	if (showLubricants) {
		taskDefList.push({
			title: data?.lubricantPluralCC || defaultCustom.lubricantPlural,
			link: links + siteAppLubricantsPath,
		});
	}
	if (showSystem) {
		taskDefList.splice(1, 0, {
			title: data?.systemPluralCC || defaultCustom.systemPlural,
			link: links + siteAppTaskSystemsPath,
		});
	}
	if (showOperations) {
		taskDefList.splice(2, 0, {
			title: data?.operatingModePluralCC || defaultCustom.operatingModePlural,
			link: links + siteAppOperationModesPath,
		});
	}

	const navigation = [
		{
			name: "Details",
			main: "Details",
			disableTo: [],
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
			disableTo: [roles.clientAdmin],
			dropdown: [
				{
					title:
						data?.application?.pauseReasonPluralCC ||
						defaultCustom.pauseReasonPlural,
					link: links + siteAppPausePath,
				},
				{
					title:
						data?.application?.stopReasonPluralCC ||
						defaultCustom.stopReasonPlural,
					link: links + siteAppStopsReasonsPath,
				},
				{
					title:
						data?.application?.skipReasonPluralCC ||
						defaultCustom.skipReasonPlural,
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
			disableTo: [roles.clientAdmin],
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
			disableTo: [roles.clientAdmin],
			dropdown: taskDefList,
		},
		{
			name: `${data?.userCC || defaultCustom?.user} Definitions`,
			main: "User Definitions",
			disableTo: [roles.clientAdmin],
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
			disableTo: [roles.clientAdmin],
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
			disableTo: [roles.clientAdmin],
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
