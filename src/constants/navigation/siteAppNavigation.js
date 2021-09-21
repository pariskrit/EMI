import { clientsPath } from "helpers/routePaths";

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
					link: `${links}`,
				},
				{
					title: "Custom Captions",
					link: `${links}/customcaptions`,
				},
			],
		},
		{
			name: "Reason Definitions",
			dropdown: [
				{
					title: "Pauses",
					link: `${links}/pauses`,
				},
				{
					title: "Stops",
					link: `${links}/stops`,
				},
				{
					title: "Skipped Tasks",
					link: `${links}/skippedtasks`,
				},
				{
					title: "Missing Part or Tools",
					link: `${links}/missingitems`,
				},
				{
					title: "Status Changes",
					link: `${links}/statuschanges`,
				},
			],
		},
		{
			name: "Model Definitions",
			dropdown: [
				{
					title: "Statuses",
					link: `${links}/modelstatuses`,
				},
				{
					title: "Types",
					link: `${links}/modeltypes`,
				},
			],
		},
		{
			name: "Task Definitions",
			dropdown: [
				{
					title: "Actions",
					link: `${links}/actions`,
				},
				{
					title: "Systems",
					link: `${links}/systems`,
				},
				{
					title: "Operating Modes",
					link: `${links}/operatingmodes`,
				},
				{
					title: "Lubricants",
					link: `${links}/lubricants`,
				},
			],
		},
		{
			name: "User Definitions",
			dropdown: [
				{
					title: "Positions",
					link: `${links}/positions`,
				},
				{
					title: "Roles",
					link: `${links}/roles`,
				},
			],
		},
		{
			name: "Defect Definitions",
			dropdown: [
				{
					title: "Risk Ratings",
					link: `${links}/defectriskratings`,
				},
				{
					title: "Statuses",
					link: `${links}/defectstatuses`,
				},
				{
					title: "Types",
					link: `${links}/defecttypes`,
				},
			],
		},
		{
			name: "Feedback Definitions",
			dropdown: [
				{
					title: "Classifications",
					link: `${links}/feedbackclassifications`,
				},
				{
					title: "Priorities",
					link: `${links}/feedbackpriorities`,
				},
				{
					title: "Statuses",
					link: `${links}/feedbackstatuses`,
				},
			],
		},
	];

	return navigation;
};

export default SiteApplicationNavigation;
