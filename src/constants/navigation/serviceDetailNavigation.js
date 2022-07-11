import {
	serviceConditionMonitorning,
	serviceDefects,
	serviceImpact,
	servicesPath,
	serviceTimes,
	serviceReport,
} from "helpers/routePaths";
/**
 * NOTE: This is currently a helper. In production, this data may come from either the API
 * or can be hard coded. Probably not approproate as a helper function
 */
const ServiceDetailNavigation = (id, detail, customCaptions) => {
	// Setting navigation links with correct Model Detail ID
	const links = `${servicesPath}/${id}`;
	const navigation = [
		{
			name: `Details`,
			url: links,
		},
		{
			name: `Impacts`,
			url: links + serviceImpact,
		},
		{
			name: `${customCaptions?.defectPlural} (${detail?.defectCount || 0})`,
			url: links + serviceDefects,
		},
		{
			name: `Condition Monitoring`,
			url: links + serviceConditionMonitorning,
		},
		{
			name: `Times`,
			url: links + serviceTimes,
		},
		{
			name: `${customCaptions?.service} Report`,
			url: links + serviceReport,
		},
		// {
		// 	name: `${customCaptions?.assetPlural} (${detail?.assetCount || 0})`,
		// 	url: links + modelAssest,
		// },
		// {
		// 	name: `${customCaptions?.stagePlural} (${detail?.stageCount || 0})`,
		// 	url: links + modelStages,
		// },
		// {
		// 	name: `${customCaptions?.zonePlural} (${detail?.zoneCount || 0})`,
		// 	url: links + modelZones,
		// },
		// {
		// 	name: `${customCaptions?.intervalPlural} (${detail?.intervalCount || 0})`,
		// 	url: links + modelIntervals,
		// },
		// {
		// 	name: `${customCaptions?.rolePlural} (${detail?.roleCount || 0})`,
		// 	url: links + modelRoles,
		// },
		// {
		// 	name: `${customCaptions?.questionPlural} (${detail?.questionCount || 0})`,
		// 	url: links + modelQuestions,
		// },
		// {
		// 	name: `${customCaptions?.taskPlural} (${detail?.taskCount || 0})`,
		// 	url: links + modelTask,
		// },
		// {
		// 	name: `${customCaptions?.service} Layout`,
		// 	url: links + modelServiceLayout,
		// },
	];

	return navigation;
};

export default ServiceDetailNavigation;
