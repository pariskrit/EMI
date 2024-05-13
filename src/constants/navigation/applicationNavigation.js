import {
	actionsPath,
	applicationListPath,
	appPath,
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
				{
					title: "Application",
					link: `${appPath}${applicationListPath}/${id}`,
				},
				{
					title: "Custom Captions",
					link: `${appPath}${applicationListPath}/${id}${customCaptionsPath}`,
				},
			],
		},
		{
			name: "Reason Definitions",
			dropdown: [
				{
					title: "Pauses",
					link: `${appPath}${applicationListPath}/${id}${pausesPath}`,
				},
				{
					title: "Stops",
					link: `${appPath}${applicationListPath}/${id}${stopsPath}`,
				},
				{
					title: "Skipped Tasks",
					link: `${appPath}${applicationListPath}/${id}${skippedTasksPath}`,
				},
				{
					title: "Missing Part or Tools",
					link: `${appPath}${applicationListPath}/${id}${missingItemsPath}`,
				},
				{
					title: "Status Changes",
					link: `${appPath}${applicationListPath}/${id}${StatusChangesPath}`,
				},
			],
		},
		{
			name: "Model Definitions",
			dropdown: [
				{
					title: "Statuses",
					link: `${appPath}${applicationListPath}/${id}${modelStatusesPath}`,
				},
				{
					title: "Types",
					link: `${appPath}${applicationListPath}/${id}${modelTypesPath}`,
				},
			],
		},
		{
			name: "Task Definitions",
			dropdown: [
				{
					title: "Actions",
					link: `${appPath}${applicationListPath}/${id}${actionsPath}`,
				},
				{
					title: "Systems",
					link: `${appPath}${applicationListPath}/${id}${systemsPath}`,
				},
				{
					title: "Operating Modes",
					link: `${appPath}${applicationListPath}/${id}${operatingModesPath}`,
				},
			],
		},
		{
			name: "User Definitions",
			dropdown: [
				{
					title: "Positions",
					link: `${appPath}${applicationListPath}/${id}${positionsPath}`,
				},
				{
					title: "Roles",
					link: `${appPath}${applicationListPath}/${id}${rolesPath}`,
				},
			],
		},
		{
			name: "Defect Definitions",
			dropdown: [
				{
					title: "Risk Ratings",
					link: `${appPath}${applicationListPath}/${id}${defectRiskRatingsPath}`,
				},
				{
					title: "Statuses",
					link: `${appPath}${applicationListPath}/${id}${defectStatusesPath}`,
				},
				{
					title: "Types",
					link: `${appPath}${applicationListPath}/${id}${defectTypesPath}`,
				},
			],
		},
		{
			name: "Feedback Definitions",
			dropdown: [
				{
					title: "Classifications",
					link: `${appPath}${applicationListPath}/${id}${feedbackClassificationsPath}`,
				},
				{
					title: "Priorities",
					link: `${appPath}${applicationListPath}/${id}${feedbackPrioritiesPath}`,
				},
				{
					title: "Statuses",
					link: `${appPath}${applicationListPath}/${id}${feedbackStatusesPath}`,
				},
			],
		},
	];

	return navigation;
};

export default ApplicationNavigation;
