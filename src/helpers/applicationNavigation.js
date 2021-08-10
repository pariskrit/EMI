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
				{ title: "Application", link: `/application/${id}` },
				{ title: "Custom Captions", link: `/application/${id}/customcaptions` },
			],
		},
		{
			name: "Reason Definitions",
			dropdown: [
				{ title: "Pauses", link: `/application/${id}/pauses` },
				{ title: "Stops", link: `/application/${id}/stops` },
				{ title: "Skipped Tasks", link: `/application/${id}/skippedtasks` },
				{
					title: "Missing Part or Tools",
					link: `/application/${id}/missingitems`,
				},
				{ title: "Status Changes", link: `/application/${id}/statuschanges` },
			],
		},
		{
			name: "Model Definitions",
			dropdown: [
				{ title: "Statuses", link: `/application/${id}/modelstatuses` },
				{ title: "Types", link: `/application/${id}/modeltypes` },
			],
		},
		{
			name: "Task Definitions",
			dropdown: [
				{ title: "Actions", link: `/application/${id}/actions` },
				{ title: "Systems", link: `/application/${id}/systems` },
				{ title: "Operating Modes", link: `/application/${id}/operatingmodes` },
			],
		},
		{
			name: "User Definitions",
			dropdown: [
				{ title: "Positions", link: `/application/${id}/positions` },
				{ title: "Roles", link: `/application/${id}/roles` },
			],
		},
		{
			name: "Defect Definitions",
			dropdown: [
				{ title: "Risk Ratings", link: `/application/${id}/defectriskratings` },
				{ title: "Statuses", link: `/application/${id}/defectstatuses` },
				{ title: "Types", link: `/application/${id}/defecttypes` },
			],
		},
		{
			name: "Feedback Definitions",
			dropdown: [
				{ title: "Classifications", link: `/application/${id}/feedbackclassifications` },
				{ title: "Priorities", link: `/application/${id}/feedbackpriorities` },
				{ title: "Statuses", link: `/application/${id}/feedbackstatuses` },
			],
		},
	];

	return navigation;
};

export default ApplicationNavigation;
