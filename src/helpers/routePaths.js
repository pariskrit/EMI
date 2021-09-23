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
export const siteAppPathForNav = sitePath + "/applications";
export const siteAppPath = sitePath + "/applications/:appId";
export const siteAppDetailPath = "/detail";
export const siteAppPausePath = "/pauses";
export const siteAppCustomCaptionsPath = "/customcaptions";
export const siteAppStopsReasonsPath = "/stopsreasons";
export const siteAppModelStatusesPath = "/modelstatuses";
export const siteAppModelTypesPath = "/modeltypes";
export const siteAppSkippedTasksPath = "/skippedtasks";
export const siteAppMissingItemsPath = "/missingitems";
export const siteAppStatusChangesPath = "/statuschanges";
export const siteAppTaskActions = "/actions";
export const siteAppTaskSystems = "/systems";
export const siteAppLubricants = "/lubricants";
export const siteAppDefectTypes = "/defecttypes";
export const siteAppFeedbackClassificationsPath = "/feedbackclassifications";

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
