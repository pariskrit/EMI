import {
	siteDetailPath,
	siteAssetPath,
	siteDepartmentPath,
	siteLocationPath,
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

export const modelScreenNavigation = [
	{ name: "Details", url: "" },
	{ name: "Equipment", url: "" },
	{ name: "Stages", url: "" },
	{ name: "Zones", url: "" },
	{ name: "Intervals", url: "" },
	{ name: "Roles", url: "" },
	{ name: "Questions", url: "" },
	{ name: "Tasks", url: "" },
	{ name: "Service Layout", url: "" },
	{ name: "Safety Alerts", url: "" },
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
