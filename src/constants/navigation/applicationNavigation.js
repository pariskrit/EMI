import {
	actionsPath,
	applicationListPath,
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
} from "helpers/routePaths";

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
				{ title: "Application", link: `${applicationListPath}/${id}` },
				{
					title: "Custom Captions",
					link: `${applicationListPath}/${id}${customCaptionsPath}`,
				},
			],
		},
		{
			name: "Reason Definitions",
			dropdown: [
				{ title: "Pauses", link: `${applicationListPath}/${id}${pausesPath}` },
				{ title: "Stops", link: `${applicationListPath}/${id}${stopsPath}` },
				{
					title: "Skipped Tasks",
					link: `${applicationListPath}/${id}${skippedTasksPath}`,
				},
				{
					title: "Missing Part or Tools",
					link: `${applicationListPath}/${id}${missingItemsPath}`,
				},
				{
					title: "Status Changes",
					link: `${applicationListPath}/${id}${StatusChangesPath}`,
				},
			],
		},
		{
			name: "Model Definitions",
			dropdown: [
				{
					title: "Statuses",
					link: `${applicationListPath}/${id}${modelStatusesPath}`,
				},
				{
					title: "Types",
					link: `${applicationListPath}/${id}${modelTypesPath}`,
				},
			],
		},
		{
			name: "Task Definitions",
			dropdown: [
				{
					title: "Actions",
					link: `${applicationListPath}/${id}${actionsPath}`,
				},
				{
					title: "Systems",
					link: `${applicationListPath}/${id}${systemsPath}`,
				},
				{
					title: "Operating Modes",
					link: `${applicationListPath}/${id}${operatingModesPath}`,
				},
			],
		},
		{
			name: "User Definitions",
			dropdown: [
				{
					title: "Positions",
					link: `${applicationListPath}/${id}${positionsPath}`,
				},
				{ title: "Roles", link: `${applicationListPath}/${id}${rolesPath}` },
			],
		},
		{
			name: "Defect Definitions",
			dropdown: [
				{
					title: "Risk Ratings",
					link: `${applicationListPath}/${id}${defectRiskRatingsPath}`,
				},
				{
					title: "Statuses",
					link: `${applicationListPath}/${id}${defectStatusesPath}`,
				},
				{
					title: "Types",
					link: `${applicationListPath}/${id}${defectTypesPath}`,
				},
			],
		},
		{
			name: "Feedback Definitions",
			dropdown: [
				{
					title: "Classifications",
					link: `${applicationListPath}/${id}${feedbackClassificationsPath}`,
				},
				{
					title: "Priorities",
					link: `${applicationListPath}/${id}${feedbackPrioritiesPath}`,
				},
				{
					title: "Statuses",
					link: `${applicationListPath}/${id}${feedbackStatusesPath}`,
				},
			],
		},
	];

	return navigation;
};

export default ApplicationNavigation;
