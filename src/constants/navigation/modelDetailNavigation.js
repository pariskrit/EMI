import {
	modelAssest,
	modelIntervals,
	modelQuestions,
	modelRoles,
	modelServiceLayout,
	modelsPath,
	modelStages,
	modelTask,
	modelZones,
} from "helpers/routePaths";

/**
 * NOTE: This is currently a helper. In production, this data may come from either the API
 * or can be hard coded. Probably not approproate as a helper function
 */
const ModelDetailNavigation = (id, caption) => {
	// Setting navigation links with correct Model Detail ID
	const links = `${modelsPath}/${id}`;
	const navigation = [
		{
			name: "Details",
			url: links,
		},
		{
			name: "Asset",
			url: links + modelAssest,
		},
		{
			name: "Stages",
			url: links + modelStages,
		},
		{
			name: "Zones",
			url: links + modelZones,
		},
		{
			name: "Intervals",
			url: links + modelIntervals,
		},
		{
			name: "Roles",
			url: links + modelRoles,
		},
		{
			name: "Questions",
			url: links + modelQuestions,
		},
		{
			name: "Tasks",
			url: links + modelTask,
		},
		{
			name: "Service Layout",
			url: links + modelServiceLayout,
		},
	];

	return navigation;
};

export default ModelDetailNavigation;
