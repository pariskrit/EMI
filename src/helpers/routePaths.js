// Client Details
export const clientsPath = "/clients";
export const clientDetailPath = clientsPath + "/:id";

// Sites
export const sitePath = clientsPath + "/:clientId/sites/:id";
export const siteDetailPath = "/detail";
export const siteAssetPath = "/assets";
export const siteDepartmentPath = "/departments";
export const siteLocationPath = "/locations";

//Site Application
export const siteApplicationPathForNav = sitePath + "/applications";
export const siteApplicationPath = sitePath + "/applications/:appId";
export const siteApplicationPausePath = siteApplicationPath + "/pauses";
export const siteApplicationPathCustomCaptions =
	siteApplicationPath + "/customcaptions";
export const siteApplicationPathStopsReasons =
	siteApplicationPath + "/stopsreasons";
export const siteApplicationOperationModesPath =
	siteApplicationPath + "/operatingmodes";
export const sitApplicationPathModelStatuses =
	siteApplicationPath + "/modelstatuses";
export const siteApplicationPathModelTypes =
	siteApplicationPath + "/modeltypes";
export const siteApplicationPathSkippedTasks =
	siteApplicationPath + "/skippedtasks";
export const siteApplicationPathMissingItems =
	siteApplicationPath + "/missingitems";
export const siteApplicationPathStatusChanges =
	siteApplicationPath + "/statuschanges";
export const siteApplicationPathDefectStatus =
	siteApplicationPath + "/defectstatuses";

//Applications
export const applicationListPath = "/applications";
export const applicationPath = "/applications";
export const applicationDetailsPath = "/applications/:id";
export const customCaptionsPath = "/customcaptions";
export const modelStatusesPath = "/modelstatuses";
export const positionsPath = "/positions";
export const rolesPath = "/roles";
export const modelTypesPath = "/modeltypes";
export const operatingModesPath = "/operatingmodes";
export const pausesPath = "/pauses";
export const stopsPath = "/stops";
export const skippedTasksPath = "/skippedtasks";
export const missingItemsPath = "/missingitems";
export const StatusChangesPath = "/StatusChanges";
export const actionsPath = "/actions";
export const systemsPath = "/systems";
export const defectRiskRatingsPath = "/defectriskratings";
export const defectStatusesPath = "/defectstatuses";
export const defectTypesPath = "/defecttypes";
export const feedbackClassificationsPath = "/feedbackclassifications";
export const feedbackPrioritiesPath = "/feedbackpriorities";
export const feedbackStatusesPath = "/feedbackstatuses";
