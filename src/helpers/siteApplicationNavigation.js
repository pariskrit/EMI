import {
	actionsPath,
	applicationPath,
	customCaptionsPath,
	defectRiskRatingsPath,
	defectStatusesPath,
	defectTypesPath,
	feedbackClassificationsPath,
	feedbackPrioritiesPath,
	feedbackStatusesPath,
	missingItemsPath,
	modelStatusesPath,
	modelTypesPath,
	operatingModesPath,
	pausesPath,
	positionsPath,
	rolesPath,
	skippedTasksPath,
	StatusChangesPath,
	stopsPath,
	systemsPath,
} from "./routePaths";

import {
	clientsPath,
	siteApplicationPathForNav,
	siteApplicationPausePath,
	siteApplicationPathCustomCaptions,
	siteApplicationPathStopsReasons,
} from "./routePaths";

/**
 * NOTE: This is currently a helper. In production, this data may come from either the API
 * or can be hard coded. Probably not approproate as a helper function
 */
const ApplicationNavigation = (id) => {
	// Setting navigation links with correct application ID
	const navigation = [
		{
			name: "Details",
			dropdown: [
				{
					title: "Application",
					link: `${clientsPath}/${id}/sites/${id}/applications/${id}`,
				},
				{
					title: "Custom Captions",
					link: `${clientsPath}/${id}/sites/${id}/applications/${id}/customcaptions`,
				},
			],
		},
		{
			name: "Reason Definitions",
			dropdown: [
				{
					title: "Pauses",
					link: `${clientsPath}/${id}/sites/${id}/applications/${id}/pause`,
				},
				{
					title: "Stops",
					link: `${clientsPath}/${id}/sites/${id}/applications/${id}/stopsreasons`,
				},
				{
					title: "Skipped Tasks",
					link: `${applicationPath}/${id}${skippedTasksPath}`,
				},
				{
					title: "Missing Part or Tools",
					link: `${applicationPath}/${id}${missingItemsPath}`,
				},
				{
					title: "Status Changes",
					link: `${applicationPath}/${id}${StatusChangesPath}`,
				},
			],
		},
		{
			name: "Model Definitions",
			dropdown: [
				{
					title: "Statuses",
					link: `${applicationPath}/${id}${modelStatusesPath}`,
				},
				{ title: "Types", link: `${applicationPath}/${id}${modelTypesPath}` },
			],
		},
		{
			name: "Task Definitions",
			dropdown: [
				{ title: "Actions", link: `${applicationPath}/${id}${actionsPath}` },
				{ title: "Systems", link: `${applicationPath}/${id}${systemsPath}` },
				{
					title: "Operating Modes",
					link: `${applicationPath}/${id}${operatingModesPath}`,
				},
			],
		},
		{
			name: "User Definitions",
			dropdown: [
				{
					title: "Positions",
					link: `${applicationPath}/${id}${positionsPath}`,
				},
				{ title: "Roles", link: `${applicationPath}/${id}${rolesPath}` },
			],
		},
		{
			name: "Defect Definitions",
			dropdown: [
				{
					title: "Risk Ratings",
					link: `${applicationPath}/${id}${defectRiskRatingsPath}`,
				},
				{
					title: "Statuses",
					link: `${applicationPath}/${id}${defectStatusesPath}`,
				},
				{ title: "Types", link: `${applicationPath}/${id}${defectTypesPath}` },
			],
		},
		{
			name: "Feedback Definitions",
			dropdown: [
				{
					title: "Classifications",
					link: `${applicationPath}/${id}${feedbackClassificationsPath}`,
				},
				{
					title: "Priorities",
					link: `${applicationPath}/${id}${feedbackPrioritiesPath}`,
				},
				{
					title: "Statuses",
					link: `${applicationPath}/${id}${feedbackStatusesPath}`,
				},
			],
		},
	];

	return navigation;
};

export default ApplicationNavigation;
