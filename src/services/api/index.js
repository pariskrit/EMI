import { BASE_API_PATH } from "helpers/constants";

const BASE_API_PATH_CLIENTS = `${BASE_API_PATH}Clients`;
const BASE_API_CLIENT_APPLICATION = `${BASE_API_PATH}ClientApplications`;
const BASE_API_CLIENT_NOTE = `${BASE_API_PATH}Clientnotes`;
const BASE_API_CLIENT_DOCUMENT = `${BASE_API_PATH}ClientDocuments`;
const BASE_API_CLIENT_REGION = `${BASE_API_PATH}Regions`;
const BASE_API_CLIENT_SITE = `${BASE_API_PATH}Sites`;
const BASE_API_PATH_SITES = `${BASE_API_PATH}SiteAssets`;
const BASE_API_PATH_SITE_ASSET_REFERENCES = `${BASE_API_PATH}SiteAssetReferences`;
const BASE_API_PATH_SITEDETAILS = `${BASE_API_PATH}sites`;
const BASE_API_PATH_LIST_OF_REGIONS = `${BASE_API_PATH}Regions`;
const BASE_API_PATH_SITE_APPKEYCONTACTS = `${BASE_API_PATH}siteappkeycontacts/Site`;
const BASE_API_PATH_SITE_APPLICATIONS = `${BASE_API_PATH}siteapps`;
const BASE_API_PATH_SITES_LOCATIONS = `${BASE_API_PATH}SiteLocations`;
const BASE_API_PATH_SITES_DEPARTMENTS = `${BASE_API_PATH}SiteDepartments`;
const BASE_API_PATH_SITE_ASSET_COUNT = `${BASE_API_PATH}SiteAssets/Count`;

export const Apis = {
	//client detail screen
	Clients: `${BASE_API_PATH_CLIENTS}`,
	ClientApplication: `${BASE_API_CLIENT_APPLICATION}`,
	ClientNote: `${BASE_API_CLIENT_NOTE}`,
	ClientDocument: `${BASE_API_CLIENT_DOCUMENT}`,
	ClientRegion: `${BASE_API_CLIENT_REGION}`,
	ClientSite: `${BASE_API_CLIENT_SITE}`,

	//sites
	SiteAssets: `${BASE_API_PATH_SITES}`,
	// Total Site Assets
	SiteAssetsCount: `${BASE_API_PATH_SITE_ASSET_COUNT}`,

	//sitereferences
	SiteReferences: `${BASE_API_PATH_SITE_ASSET_REFERENCES}`,
	//site details
	SiteDetails: `${BASE_API_PATH_SITEDETAILS}`,

	//regions
	ListOfRegions: `${BASE_API_PATH_LIST_OF_REGIONS}`,

	//siteappkeycontacts
	KeyContacts: `${BASE_API_PATH_SITE_APPKEYCONTACTS}`,

	//site applications
	Applications: `${BASE_API_PATH_SITE_APPLICATIONS}`,
	SiteLocations: `${BASE_API_PATH_SITES_LOCATIONS}`,
	SiteDepartments: `${BASE_API_PATH_SITES_DEPARTMENTS}`,
};