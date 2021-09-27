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

export const defectStatusTypes = [
	{ label: "Outstanding", value: "O" },
	{ label: "Notification Raised", value: "N" },
	{ label: "Complete", value: "C" },
];

export const DefaultPageSize = 12;
