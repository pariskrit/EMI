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
const BASE_API_PATH_STOP_REASONS = `${BASE_API_PATH}StopReasons`;
const BASE_API_PATH_OPERATING_MODES = `${BASE_API_PATH}operatingModes`;
const BASE_API_PATH_MODEL_STATUSES = `${BASE_API_PATH}modelstatuses`;
const BASE_API_PATH_MODEL_TYPES = `${BASE_API_PATH}ModelTypes`;
const BASE_API_PATH_SKIPPED_TASKS = `${BASE_API_PATH}SkipTaskReasons`;
const BASE_API_PATH_MISSING_PART_OR_TOOL_REASONS = `${BASE_API_PATH}MissingPartToolReasons`;
const BASE_API_PATH_STATUS_CHANGES = `${BASE_API_PATH}changestatusreasons`;
const BASE_API_PATH_DEFECT_STATUSES = `${BASE_API_PATH}defectstatuses`;
const BASE_API_PATH_FEEDBACK_CLASSIFICATIONS = `${BASE_API_PATH}feedbackclassifications`;
const BASE_API_PATH_ACTIONS = `${BASE_API_PATH}actions`;
const BASE_API_PATH_SYSTEMS = `${BASE_API_PATH}systems`;
const BASE_API_PATH_LUBRICANTS = `${BASE_API_PATH}lubricants`;
const BASE_API_PATH_DEFECT_TYPES = `${BASE_API_PATH}defecttypes`;

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

	//stop reasons
	StopReasons: `${BASE_API_PATH_STOP_REASONS}`,

	OperatingModes: `${BASE_API_PATH_OPERATING_MODES}`,
	ModelStatuses: `${BASE_API_PATH_MODEL_STATUSES}`,
	ModelTypes: `${BASE_API_PATH_MODEL_TYPES}`,
	defectStatuses: `${BASE_API_PATH_DEFECT_STATUSES}`,

	//skippedTasks
	SkippedTasks: `${BASE_API_PATH_SKIPPED_TASKS}`,

	//missingPartorToolReasons
	MissingPartorToolReasons: `${BASE_API_PATH_MISSING_PART_OR_TOOL_REASONS}`,

	//statusChanges
	StatusChanges: `${BASE_API_PATH_STATUS_CHANGES}`,

	//feedbackClassifications
	FeedbackClassifications: `${BASE_API_PATH_FEEDBACK_CLASSIFICATIONS}`,

	//actions
	Actions: `${BASE_API_PATH_ACTIONS}`,

	//systems
	Systems: `${BASE_API_PATH_SYSTEMS}`,

	//lubricants
	Lubricants: `${BASE_API_PATH_LUBRICANTS}`,

	//defecttypes
	DefectTypes: `${BASE_API_PATH_DEFECT_TYPES}`,
};
