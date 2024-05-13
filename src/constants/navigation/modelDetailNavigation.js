import {
	appPath,
	modelArrangement,
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
	const links = `${appPath}${modelsPath}/${id}`;
	const navigation = [
		{
			name: `Details`,
			url: links,
		},
		{
			name: `${customCaptions?.assetPlural} (${detail?.assetCount || 0})`,
			url: links + modelAssest,
		},
		{
			name: `${customCaptions?.arrangementPlural || "Arrangements"} (${
				detail?.arrangementCount || 0
			})`,
			url: links + modelArrangement,
		},
		{
			name: `${customCaptions?.stagePlural} (${detail?.stageCount || 0})`,
			url: links + modelStages,
		},
		{
			name: `${customCaptions?.zonePlural} (${detail?.zoneCount || 0})`,
			url: links + modelZones,
		},
		{
			name: `${customCaptions?.intervalPlural} (${detail?.intervalCount || 0})`,
			url: links + modelIntervals,
		},
		{
			name: `${customCaptions?.rolePlural} (${detail?.roleCount || 0})`,
			url: links + modelRoles,
		},
		{
			name: `${customCaptions?.questionPlural} (${detail?.questionCount || 0})`,
			url: links + modelQuestions,
		},
		{
			name: `${customCaptions?.taskPlural} (${detail?.taskCount || 0})`,
			url: links + modelTask,
		},
		{
			name: `${customCaptions?.service} Layout`,
			url: links + modelServiceLayout,
		},
	];

	return navigation;
};

export default ModelDetailNavigation;
