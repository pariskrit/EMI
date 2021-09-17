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
export const siteApplicationPath = sitePath + "/applications/:appId";
export const siteApplicationPausePath = siteApplicationPath + "/pause";

//Applications
export const applicationListPath = "/applicationList";
export const applicationPath = "/application";
export const applicationDetailsPath = "/application/:id";
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
