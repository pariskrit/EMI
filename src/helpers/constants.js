import {
	siteDetailPath,
	siteAssetPath,
	siteDepartmentPath,
	siteLocationPath,
	modelDetail,
	modelStages,
	modelZones,
	modelIntervals,
	modelRoles,
	modelQuestions,
	modelTask,
	modelServiceLayout,
	modelAssest,
} from "helpers/routePaths";

export const BASE_API_PATH = "/api/";

export const clientOptions = [
	{ label: "Total Users", value: 0 },
	{ label: "Concurrent Users", value: 1 },
	{ label: "Per Job", value: 2 },
	{ label: "Site-Based Licencing", value: 3 },
];

export const siteOptions = [
	{ label: "Total Users", value: 0 },
	{ label: "Concurrent Users", value: 1 },
	{ label: "Per Job Per Role", value: 2 },
	{ label: "Application-Based Licencing", value: 3 },
];

export const siteApplicationOptions = [
	{ label: "Total Users", value: 0 },
	{ label: "Concurrent Users", value: 1 },
	{ label: "Per Job", value: 2 },
];

export const siteScreenNavigation = [
	{ name: "Details", url: siteDetailPath },
	{ name: "Assets", url: siteAssetPath },
	{ name: "Departments", url: siteDepartmentPath },
	{ name: "Locations", url: siteLocationPath },
];

export const modelScreenNavigation = ({
	assests,
	stages,
	zones,
	intervals,
	roles,
	questions,
	tasks,
}) => [
	{ name: "Details", url: modelDetail },
	{ name: `Assests(${assests})`, url: modelAssest },
	{ name: `Stages(${stages})`, url: modelStages },
	{ name: `Zones(${zones})`, url: modelZones },
	{ name: `Intervals(${intervals})`, url: modelIntervals },
	{ name: `Roles(${roles})`, url: modelRoles },
	{ name: `Questions(${questions})`, url: modelQuestions },
	{ name: `Tasks(${tasks})`, url: modelTask },
	{ name: "Service Layout", url: modelServiceLayout },
];

export const defectStatusTypes = [
	{ label: "Outstanding", value: "O" },
	{ label: "Notification Raised", value: "N" },
	{ label: "Complete", value: "C" },
];

// export const positionTypes = [
// 	{ label: "Full", value: "F" },
// 	{ label: "Edit", value: "E" },
// 	{ label: "Read-Only", value: "R" },
// 	{ label: "None", value: "N" },
// ];

export const positionAccessTypes = {
	F: "Full",
	E: "Edit",
	R: "Read-Only",
	N: "None",
};

export const DefaultPageSize = 12;

export const NotificationAlerts = {
	success: "#24BA78",
	error: "#E31212",
	info: "#307AD6",
	warning: "#ED8738",
};
