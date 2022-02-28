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
const ModelDetailNavigation = (id, detail) => {
	// Setting navigation links with correct Model Detail ID
	const links = `${modelsPath}/${id}`;
	const navigation = [
		{
			name: `Details`,
			url: links,
		},
		{
			name: `Asset (${detail.assetCount})`,
			url: links + modelAssest,
		},
		{
			name: `Stages (${detail.stageCount})`,
			url: links + modelStages,
		},
		{
			name: `Zones (${detail.zoneCount})`,
			url: links + modelZones,
		},
		{
			name: `Intervals (${detail.intervalCount})`,
			url: links + modelIntervals,
		},
		{
			name: `Roles (${detail.roleCount})`,
			url: links + modelRoles,
		},
		{
			name: `Questions (${detail.questionCount})`,
			url: links + modelQuestions,
		},
		{
			name: `Tasks (${detail.taskCount})`,
			url: links + modelTask,
		},
		{
			name: `Service Layout`,
			url: links + modelServiceLayout,
		},
	];

	return navigation;
};

export default ModelDetailNavigation;
