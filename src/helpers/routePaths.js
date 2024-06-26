export const loginPath = "/login";
export const appPath = "/app/";

// Client Details
export const clientPath = "/app/client";
export const clientsPath = "clients";
export const clientDetailPath = "/:id";

//Client Setting
export const clientSettingPath = "/app/clientSetting";

//Users List
export const usersPath = "users";
export const userDetailPath = usersPath + "/:id";
export const userDetailSitePath = "/sites";
export const userModelAccess = "/modelaccess";

//Application Portal
export const applicationPortalPath = "portal";
//User Profile
export const userProfilePath = "me";
export const siteUserLoginPath = "/app/me";

// Sites
export const sitePath = clientsPath + "/:clientId/sites/:id";
export const siteDetailPath = "detail";
export const siteAssetPath = "/assets";
export const siteDepartmentPath = "/departments";
export const siteLocationPath = "/locations";
export const siteLicenses = "/licenses";

//Site Application
export const siteAppPathForNav = sitePath + "/applications";
export const siteAppPath = sitePath + "/applications/:appId";
export const siteAppDetailPath = "detail";
export const siteAppPausePath = "pauses";
export const siteAppCustomCaptionsPath = "customcaptions";
export const siteAppStopsReasonsPath = "stopsreasons";
export const siteAppOperationModesPath = "operatingmodes";
export const siteAppModelStatusesPath = "modelstatuses";
export const siteAppModelTypesPath = "modeltypes";
export const siteAppSkippedTasksPath = "skippedtasks";
export const siteAppMissingItemsPath = "missingitems";
export const siteAppStatusChangesPath = "statuschanges";
export const siteAppTaskActionsPath = "actions";
export const siteAppTaskSystemsPath = "systems";
export const siteAppLubricantsPath = "lubricants";
export const siteAppDefectTypesPath = "defecttypes";
export const siteAppUserRolesPath = "roles";
export const siteAppFeedbackClassificationsPath = "feedbackclassifications";
export const siteAppFeedbackPrioritiesPath = "feedbackpriorities";
export const siteAppDefectStatusPath = "defectstatuses";
export const siteAppDefectRiskRatingsPath = "defectriskratings";
export const siteAppPositionsPath = "positions";
export const siteAppFeedbackStatuses = "feedbackstatuses";
export const siteAppTaskLubricants = "lubricants";

//Applications
export const applicationListPath = "applications";
export const applicationPath = "/applications";
export const applicationDetailsPath = "/app/applications/:id";
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

//Models List
export const modelsPath = "models";
export const modelDetailsPath = modelsPath + "/:id";
export const modelImport = "/app/model/import";
export const analyticsPath = "analytics";

export const analysisPath = "/app/analysis";
export const noticeboardPath = "noticeboards";
export const settingPath = "/app/setting";
export const defectExportPath = "/app/defectexport";
export const modelDetail = "/";
export const modelAssest = "/assets";
export const modelArrangement = "/arrangements";
export const modelStages = "/stages";
export const modelZones = "/zones";
export const modelIntervals = "/intervals";
export const modelRoles = "/roles";
export const modelQuestions = "/questions";
export const modelTask = "/tasks";
export const modelServiceLayout = "/service-layout";

// Services List
export const servicesPath = "services";
export const serviceGraph = "graph/chartview";
export const serviceDetailsPath = servicesPath + "/:id";
export const serviceImpact = "service-impacts";
export const serviceDefects = "service-defects";
export const serviceConditionMonitorning = "service-condition-monitoring";
export const serviceTimes = "service-times";
export const serviceReport = "service-report";

// Defects List
export const defectsPath = "defects";
export const defectsDetailsPath = `${defectsPath}/:id`;

// Feedback
export const feedbackPath = "feedback";
export const FeedbackDetailsPath = feedbackPath + "/:id";

//analytics
export const defectsByTypePath = "defects-by-type";
export const defectsByRiskRatingPath = "defects-by-riskrating";
export const defectsBySystemPath = "defects-by-system";
export const defectsRegisteredPath = "defects-registered";
export const missingPartsToolsPath = "missing-part-tools";
export const overdueServicesPath = "overdue-services";
export const plannedWorkPath = "planned-work";
export const servicePausePath = "service-pause";
export const serviceSkippedPath = "service-skipped";
export const serviceStatusPath = "service-status";
export const serviceStopPath = "service-stop";
export const completedOutstangindDefectPath = "completed-outstanding";
export const conditionMonitoringPath = "condition-monitoring";
export const serviceAverageTime = "service-average";
