import { BASE_API_PATH } from "helpers/constants";

const BASE_API_PATH_CLIENTS = `${BASE_API_PATH}Clients`;
const BASE_API_PATH_SITES = `${BASE_API_PATH}SiteAssets`;
const BASE_API_PATH_SITES_LOCATIONS = `${BASE_API_PATH}SiteLocations`;
const BASE_API_PATH_SITES_DEPARTMENTS = `${BASE_API_PATH}SiteDepartments`;

export const Apis = {
	//client detail screen
	Clients: `${BASE_API_PATH_CLIENTS}`,

	//sites
	SiteAssets: `${BASE_API_PATH_SITES}`,
	SiteLocations: `${BASE_API_PATH_SITES_LOCATIONS}`,
	SiteDepartments: `${BASE_API_PATH_SITES_DEPARTMENTS}`,
};
