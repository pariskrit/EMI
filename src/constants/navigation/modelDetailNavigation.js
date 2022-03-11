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
const ModelDetailNavigation = (id, detail, customCaptions) => {
	// Setting navigation links with correct Model Detail ID
	const links = `${modelsPath}/${id}`;
	const navigation = [
		{
			name: `Details`,
			url: links,
		},
		{
			name: `${customCaptions.asset} (${detail.assetCount || ""})`,
			url: links + modelAssest,
		},
		{
			name: `${customCaptions.stagePlural} (${detail.stageCount || ""})`,
			url: links + modelStages,
		},
		{
			name: `${customCaptions.zonePlural} (${detail.zoneCount || ""})`,
			url: links + modelZones,
		},
		{
			name: `${customCaptions.intervalPlural} (${detail.intervalCount || ""})`,
			url: links + modelIntervals,
		},
		{
			name: `${customCaptions.rolePlural} (${detail.roleCount || ""})`,
			url: links + modelRoles,
		},
		{
			name: `${customCaptions.questionPlural} (${detail.questionCount || ""})`,
			url: links + modelQuestions,
		},
		{
			name: `${customCaptions.taskPlural} (${detail.taskCount || ""})`,
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
