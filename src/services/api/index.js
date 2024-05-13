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
const BASE_API_PATH_SITE_APP_KEY_CONTACTS = `${BASE_API_PATH}SiteAppKeyContacts`;

const BASE_API_PATH_SITE_APPLICATIONS = `${BASE_API_PATH}siteapps`;
const BASE_API_PATH_SITES_LOCATIONS = `${BASE_API_PATH}SiteLocations`;
const BASE_API_PATH_SITES_DEPARTMENTS = `${BASE_API_PATH}SiteDepartments`;
const BASE_API_PATH_APPLICATION_POSITIONS = `${BASE_API_PATH}ApplicationPositions`;
const BASE_API_PATH_SITE_ASSET_COUNT = `${BASE_API_PATH}SiteAssets/Count`;
const BASE_API_PATH_STOP_REASONS = `${BASE_API_PATH}StopReasons`;
const BASE_API_PATH_OPERATING_MODES = `${BASE_API_PATH}operatingModes`;
const BASE_API_PATH_MODEL_STATUSES = `${BASE_API_PATH}modelstatuses`;
const BASE_API_PATH_MODEL_TYPES = `${BASE_API_PATH}ModelTypes`;
const BASE_API_PATH_SKIPPED_TASKS = `${BASE_API_PATH}SkipTaskReasons`;
const BASE_API_PATH_PAUSES = `${BASE_API_PATH}Pauses`;
const BASE_API_PATH_MISSING_PART_OR_TOOL_REASONS = `${BASE_API_PATH}MissingPartToolReasons`;
const BASE_API_PATH_STATUS_CHANGES = `${BASE_API_PATH}changestatusreasons`;
const BASE_API_PATH_DEFECT_STATUSES = `${BASE_API_PATH}defectstatuses`;
const BASE_API_PATH_FEEDBACK_CLASSIFICATIONS = `${BASE_API_PATH}feedbackclassifications`;
const BASE_API_PATH_FEEDBACK_STATUSES = `${BASE_API_PATH}feedbackstatuses`;
const BASE_API_PATH_FEEDBACK_PRIORITIES = `${BASE_API_PATH}feedbackpriorities`;
const BASE_API_PATH_ACTIONS = `${BASE_API_PATH}actions`;
const BASE_API_PATH_SYSTEMS = `${BASE_API_PATH}systems`;
const BASE_API_PATH_LUBRICANTS = `${BASE_API_PATH}lubricants`;
const BASE_API_PATH_POSITIONS = `${BASE_API_PATH}positions`;
const BASE_API_PATH_DEFECT_TYPES = `${BASE_API_PATH}defecttypes`;
const BASE_API_PATH_ROLES = `${BASE_API_PATH}roles`;
const BASE_API_PATH_DEFECT_RISK_RATINGS = `${BASE_API_PATH}defectriskratings`;
const BASE_API_PATH_APPLICATION_PORTAL = `${BASE_API_PATH}users/me/clients`;
const BASE_API_PATH_APPLICATIONS_AND_SITES = `${BASE_API_PATH}users/me/portal`;
const BASE_API_PATH_USER_SITEs = `${BASE_API_PATH}clientusers`;
const BASE_API_PATH_CLIENT_USER_SITES = `${BASE_API_PATH}clientusersites`;
const BASE_API_PATH_CLIENT_USER_SITES_APPS = `${BASE_API_PATH}ClientUserSiteApps`;
const BASE_API_PATH_CLIENT_USERS = `${BASE_API_PATH}ClientUsers`;
const BASE_API_PATH_REPORTING = `${BASE_API_PATH}Reporting`;

// Application
const BASE_API_PATH_APPLICATIONS = `${BASE_API_PATH}Applications`;

//Users
const BASE_API_PATH_USERSLIST = `${BASE_API_PATH}users`;
const BASE_API_PATH_CLIENTUSERSITEAPPS = `${BASE_API_PATH}clientusersiteapps`;
const BASE_API_PATH_CLIENT_USER_SITE_APP_SERVICE_DEPARTMENTS = `${BASE_API_PATH}clientusersiteappservicedepartments`;
const BASE_API_PATH_CLIENT_USER_SITE_APP_SERVICE_ROLES = `${BASE_API_PATH}clientusersiteappserviceroles`;
const BASE_API_PATH_CLIENT_USER_SITE_APP_SERVICE_MODELS = `${BASE_API_PATH}clientusersiteappservicemodels`;

// Register user email
const BASE_API_PATH_REGISTER_USER_EMAIL = `${BASE_API_PATH}Users/RegisterEmail`;

//forgot password
const BASE_API_PATH_FORGOT_PASSWORD = `${BASE_API_PATH}Users/ForgotPassword`;

// reset password
const BASE_API_PATH_RESET_PASSWORD = `${BASE_API_PATH}Users/ResetPassword`;

//login to client admin

const BASE_API_PATH_CLIENT_ADMIN = `${BASE_API_PATH}Users/LoginToClientAdmin`;

//UserDetails
const BASE_API_PATH_USERDETAILSNOTEPOST = `${BASE_API_PATH}clientusernotes`;
const BASE_API_PATH_USERDETAILSNOTE = `${BASE_API_PATH_USERDETAILSNOTEPOST}?clientUserId=`;
const BASE_API_PATH_USERREFERENCE = `${BASE_API_PATH}clientuser`;
const BASE_API_PATH_USERPROFILE = `${BASE_API_PATH_USERSLIST}/me`;
const BASE_API_PATH_USERPROFILEPASSWORDCHANGE = `${BASE_API_PATH_USERPROFILE}/ChangePassword`;

//Models
const BASE_API_PATH_MODEL_LIST = `${BASE_API_PATH}models`;
const BASE_API_PATH_DUPLICATE_MODEL = `${BASE_API_PATH_MODEL_LIST}/duplicate`;
const BASE_API_PATH_MODEL_VERSIONS = `${BASE_API_PATH}ModelVersions`;
const BASE_API_PATH_MODEL_VERSIONS_LIST = `versions`;

const BASE_API_PATH_MODEL_IMPORTS = `${BASE_API_PATH}ModelImports`;
const BASE_API_PATH_MODEL_ROLES = `${BASE_API_PATH}ModelVersionRoles`;
const BASE_API_PATH_MODEL_ZONES = `${BASE_API_PATH}ModelVersionZones`;
const BASE_API_PATH_MODEL_QUESTIONS = `${BASE_API_PATH}ModelVersionQuestions`;
const BASE_API_PATH_MODEL_QUESTION_ROLE = `${BASE_API_PATH}ModelVersionQuestionRoles`;
const BASE_API_PATH_MODEL_QUESTION_OPTION = `${BASE_API_PATH}ModelVersionQuestionOptions`;
const BASE_API_PATH_MODEL_TASKS = `${BASE_API_PATH}ModelVersionTasks`;
const BASE_API_PATH_MODEL_TASKS_QUESTIONS = `${BASE_API_PATH}ModelVersionTaskQuestions`;
const BASE_API_PATH_MODEL_TASKS_QUESTION_OPTIONS = `${BASE_API_PATH}ModelVersionTaskQuestionOptions`;

const BASE_API_PATH_MODEL_VERSION_TASK_ARRANGEMENT = `${BASE_API_PATH}ModelVersionTaskArrangements`;
const BASE_API_PATH_MODEL_TASKS_STAGES = `${BASE_API_PATH}ModelVersionTaskStages`;
const BASE_API_PATH_MODEL_ASSETS = `${BASE_API_PATH}ModelAssets`;
const BASE_API_PATH_MODEL_VERSION_TASK_INTERVAL = `${BASE_API_PATH}ModelVersionTaskIntervals`;

// Model Stages
const BASE_API_PATH_MODEL_STAGES = `${BASE_API_PATH}modelversionstages`;
const BASE_API_PATH_MODEL_INTERVALS = `${BASE_API_PATH}modelversionintervals`;

const BASE_API_PATH_MODEL_VERSION_INTERVAL_INCLUDES = `${BASE_API_PATH}modelversionintervalincludes`;

const BASE_API_PATH_MODEL_INTERVALS_TASK_LIST_NOS = `${BASE_API_PATH}ModelIntervalTaskListNos`;
//ModelDetails
const BASE_API_PATH_MODEL_VERSION_DEPARTMENTS = `${BASE_API_PATH}ModelVersionDepartments`;
const BASE_API_PATH_MODEL_NOTES = `${BASE_API_PATH}ModelNotes`;
const BASE_API_PATH_MODEL_DOCUMENTS = `${BASE_API_PATH}ModelDocuments`;

// Model Task Notes
const BASE_API_PATH_MODEL_TASK_NOTES = `${BASE_API_PATH}ModelTaskNotes`;

// Model Version Arrangements
const BASE_API_PATH_MODEL_VERSION_ARRANGMENTS = `${BASE_API_PATH}ModelVersionArrangements`;

// Model Task Parts
const BASE_API_PATH_MODEL_TASK_PARTS = `${BASE_API_PATH}ModelVersionTaskParts`;

// Model Task zones
const BASE_API_PATH_MODEL_TASK_ZONES = `${BASE_API_PATH}ModelVersionTaskZones`;

//Model Task Images
const BASE_API_PATH_MODEL_TASK_IMAGES = `${BASE_API_PATH}ModelVersionTaskImages`;

// Model Task RolesContent
const BASE_API_PATH_MODEL_VERSION_TASK_ROLES = `${BASE_API_PATH}ModelVersionTaskRoles`;

// Model Task Tools
const BASE_API_PATH_MODEL_TASK_TOOLS = `${BASE_API_PATH}ModelVersionTaskTools`;

// Model Task Permits
const BASE_API_PATH_MODEL_TASK_PERMITS = `${BASE_API_PATH}ModelVersionTaskPermits`;

// Model Task Attachments
const BASE_API_PATH_MODEL_TASK_ATTACHMENTS = `${BASE_API_PATH}ModelVersionTaskDocuments`;

// Model Published
const BASE_API_PATH_MODELS_PUBLISHED = `${BASE_API_PATH}Models/published`;

// Services
const BASE_API_PATH_SERVICES = `${BASE_API_PATH}services`;

// Services Notes
const BASE_API_PATH_SERVICES_NOTES = `${BASE_API_PATH}ServiceNotes`;

// Defects
const BASE_API_PATH_DEFECTS = `${BASE_API_PATH}Defects`;
const BASE_API_PATH_DEFECTS_SEARCH = `${BASE_API_PATH}Defects/search`;
const BASE_API_PATH_DEFECTS_AUTOCOMPLETE = `${BASE_API_PATH}Defects/autocomplete`;
const BASE_API_PATH_DEFECT_NOTES = `${BASE_API_PATH}DefectNotes`;
const BASE_API_PATH_DEFECT_IMAGES = `${BASE_API_PATH}DefectImages`;
const BASE_API_PATH_DEFECT_PARTS = `${BASE_API_PATH}DefectParts`;

// Feedback
const BASE_API_PATH_FEEDBACK = `${BASE_API_PATH}Feedback`;
const BASE_API_PATH_FEEDBACK_NOTES = `${BASE_API_PATH}FeedbackNotes`;
const BASE_API_PATH_FEEDBACK_IMAGES = `${BASE_API_PATH}FeedbackImages`;

// NoticeBoards
const BASE_API_PATH_NOTICE_BOARDS = `${BASE_API_PATH}Noticeboards`;
const BASE_API_PATH_NOTICE_BOARDS_DEPARTMENTS = `${BASE_API_PATH}NoticeboardDepartments`;

//Analytics
const BASE_API_PATH_ANALYTICS = `${BASE_API_PATH}Analytics`;

//History
//MODEL
const BASE_API_PATH_HISTORY_MODEL_DETAILS = `${BASE_API_PATH}history/modelversions/`;
const BASE_API_PATH_HISTORY_MODEL_ASSETS = `${BASE_API_PATH}history/modelassets?modelId=`;
const BASE_API_PATH_HISTORY_MODEL_ARRANGEMENTS = `${BASE_API_PATH}history/modelversionarrangements?modelVersionId=`;
const BASE_API_PATH_HISTORY_MODEL_STAGES = `${BASE_API_PATH}history/modelversionstages?modelVersionId=`;
const BASE_API_PATH_HISTORY_MODEL_ZONES = `${BASE_API_PATH}history/modelversionzones?modelVersionId=`;
const BASE_API_PATH_HISTORY_MODEL_INTERVAL = `${BASE_API_PATH}history/modelversionintervals?modelVersionId=`;
const BASE_API_PATH_HISTORY_MODEL_ROLES = `${BASE_API_PATH}history/modelversionroles?modelVersionId=`;
const BASE_API_PATH_HISTORY_MODEL_QUESTIONS = `${BASE_API_PATH}history/modelversionquestions?modelVersionId=`;
const BASE_API_PATH_HISTORY_MODEL_TASKS = `${BASE_API_PATH}history/modelversiontasks?modelVersionId=`;
//History services
const BASE_API_PATH_HISTORY_SERVICE_DETAILS = `${BASE_API_PATH}history/services/`;
//History defects
const BASE_API_PATH_HISTORY_DEFECTS = `${BASE_API_PATH}history/defects/`;
//History feedback
const BASE_API_PATH_HISTORY_FEEDBACK = `${BASE_API_PATH}history/feedbacks/`;
//History user
const BASE_API_PATH_HISTORY_USER = `${BASE_API_PATH}history/clientUserSiteApp/`;
const BASE_API_PATH_HISTORY_USERADMIN = `${BASE_API_PATH}history/userdetails/`;
//Hisotry Site
const BASE_API_PATH_HISTORY_SITE_SETTINGS = `${BASE_API_PATH}history/sitesettings/`;
const BASE_API_PATH_HISTORY_SITE_ASSETS = `${BASE_API_PATH}history/siteassets/`;
const BASE_API_PATH_HISTORY_SITE_DEPARTMENTS = `${BASE_API_PATH}history/sitedepartments/`;
//History Site Application
const BASE_API_PATH_HISTORY_SITEAPP_FEEDBACK_STATUSES = `${BASE_API_PATH}history/siteappfeedbackstatuses/`;
const BASE_API_PATH_HISTORY_SITEAPP_FEEDBACK_PRIORITIES = `${BASE_API_PATH}history/siteappfeedbackpriorities/`;
const BASE_API_PATH_HISTORY_SITEAPP_FEEDBACK_CLASSIFICATIONS = `${BASE_API_PATH}history/siteappfeedbackclassifications/`;
const BASE_API_PATH_HISTORY_SITEAPP_DEFECT_TYPES = `${BASE_API_PATH}history/siteappdefecttypes/`;
const BASE_API_PATH_HISTORY_SITEAPP_DEFECT_STATUSES = `${BASE_API_PATH}history/siteappdefectstatuses/`;
const BASE_API_PATH_HISTORY_SITEAPP_DEFECT_RISKRATINGS = `${BASE_API_PATH}history/siteappdefectriskratings/`;
const BASE_API_PATH_HISTORY_SITEAPP_ROLES = `${BASE_API_PATH}history/siteapproles/`;
const BASE_API_PATH_HISTORY_SITEAPP_POSITIONS = `${BASE_API_PATH}history/siteapppositions/`;
const BASE_API_PATH_HISTORY_SITEAPP_OPERATING_MODES = `${BASE_API_PATH}history/siteappoperatingmodes/`;
const BASE_API_PATH_HISTORY_SITEAPP_LUBRICANTS = `${BASE_API_PATH}history/siteapplubricants/`;
const BASE_API_PATH_HISTORY_SITEAPP_SYSTEMS = `${BASE_API_PATH}history/siteappsystems/`;
const BASE_API_PATH_HISTORY_SITEAPP_ACTIONS = `${BASE_API_PATH}history/siteappactions/`;
const BASE_API_PATH_HISTORY_SITEAPP_MODEL_TYPES = `${BASE_API_PATH}history/siteappmodeltypes/`;
const BASE_API_PATH_HISTORY_SITEAPP_MODEL_STATUSES = `${BASE_API_PATH}history/siteappmodelstatuses/`;
const BASE_API_PATH_HISTORY_SITEAPP_CHANGE_STATUS_REASONS = `${BASE_API_PATH}history/siteappchangestatusreasons/`;
const BASE_API_PATH_HISTORY_SITEAPP_MISSING_PART_TOOL_REASONS = `${BASE_API_PATH}history/siteappmissingparttoolreasons/`;
const BASE_API_PATH_HISTORY_SITEAPP_SKIP_REASONS = `${BASE_API_PATH}history/siteappskipreasons/`;
const BASE_API_PATH_HISTORY_SITEAPP_STOP_REASONS = `${BASE_API_PATH}history/siteappstopreasons/`;
const BASE_API_PATH_HISTORY_SITEAPP_PAUSE_REASONS = `${BASE_API_PATH}history/siteapppausereasons/`;
const BASE_API_PATH_HISTORY_SITEAPP_DETAILS = `${BASE_API_PATH}history/siteappdetails/`;

//History Application
const BASE_API_PATH_HISTORY_APP_DETAILS = `${BASE_API_PATH}history/applicationdetails/`;
const BASE_API_PATH_HISTORY_APP_PAUSE_REASON = `${BASE_API_PATH}history/applicationpauses/`;
const BASE_API_PATH_HISTORY_APP_STOP_REASON = `${BASE_API_PATH}history/applicationstopreasons/`;
const BASE_API_PATH_HISTORY_APP_SKIP_REASON = `${BASE_API_PATH}history/applicationskipreasons/`;
const BASE_API_PATH_HISTORY_APP_MISSING_PART_TOOL_REASON = `${BASE_API_PATH}history/applicationmissingparttoolreasons/`;
const BASE_API_PATH_HISTORY_APP_CHANGE_STATUS_REASON = `${BASE_API_PATH}history/applicationchangestatusreasons/`;
const BASE_API_PATH_HISTORY_APP_MODEL_STATUSES = `${BASE_API_PATH}history/applicationmodelstatuses/`;
const BASE_API_PATH_HISTORY_APP_MODEL_TYPES = `${BASE_API_PATH}history/applicationmodeltypes/`;
const BASE_API_PATH_HISTORY_APP_ACTIONS = `${BASE_API_PATH}history/applicationactions/`;
const BASE_API_PATH_HISTORY_APP_SYSTEMS = `${BASE_API_PATH}history/applicationsystems/`;
const BASE_API_PATH_HISTORY_APP_OPERATING_MODES = `${BASE_API_PATH}history/applicationoperatingmodes/`;
const BASE_API_PATH_HISTORY_APP_POSITIONS = `${BASE_API_PATH}history/applicationpositions/`;
const BASE_API_PATH_HISTORY_APP_ROLES = `${BASE_API_PATH}history/applicationroles/`;
const BASE_API_PATH_HISTORY_APP_DEFECT_RISK_RATINGS = `${BASE_API_PATH}history/applicationdefectriskratings/`;
const BASE_API_PATH_HISTORY_APP_DEFECT_STATUSES = `${BASE_API_PATH}history/applicationdefectstatuses/`;
const BASE_API_PATH_HISTORY_APP_DEFECT_TYPES = `${BASE_API_PATH}history/applicationdefecttypes/`;
const BASE_API_PATH_HISTORY_APP_FEEDBACK_CLASSIFICATIONS = `${BASE_API_PATH}history/applicationfeedbackclassifications/`;
const BASE_API_PATH_HISTORY_APP_FEEDBACK_PRIORITIES = `${BASE_API_PATH}history/applicationfeedbackpriorities/`;
const BASE_API_PATH_HISTORY_APP_FEEDBACK_STATUSES = `${BASE_API_PATH}history/applicationfeedbackstatuses/`;

//History noticeboards
const BASE_API_PATH_HISTORY_NOTICEBOARD = `${BASE_API_PATH}history/noticeboards?siteAppId=`;
//History ClientDetails
const BASE_API_PATH_HISTORY_CLIENTDETAILS = `${BASE_API_PATH}history/clientdetails/`;

export const Apis = {
	// register email
	RegisterEmail: `${BASE_API_PATH_REGISTER_USER_EMAIL}`,

	// forgotPassword
	ForgotPasswrod: `${BASE_API_PATH_FORGOT_PASSWORD}`,

	// resetPassword
	ResetPassword: `${BASE_API_PATH_RESET_PASSWORD}`,

	//users list
	UsersList: `${BASE_API_PATH_USERSLIST}`,

	ClientUser: `${BASE_API_PATH_CLIENT_USERS}`,

	//userDetails
	UserDetailsNote: `${BASE_API_PATH_USERDETAILSNOTE}`,
	UserDetailsNotePost: `${BASE_API_PATH_USERDETAILSNOTEPOST}`,
	UserDetailReference: `${BASE_API_PATH_USERREFERENCE}`,
	userDetailSites: `${BASE_API_PATH_USER_SITEs}`,

	//clientAdmin
	ClientAdmin: BASE_API_PATH_CLIENT_ADMIN,

	//userProfile
	UserProfile: `${BASE_API_PATH_USERPROFILE}`,
	UserProfilePasswordChange: `${BASE_API_PATH_USERPROFILEPASSWORDCHANGE}`,

	//client detail screen
	Clients: `${BASE_API_PATH_CLIENTS}`,
	ClientApplication: `${BASE_API_CLIENT_APPLICATION}`,
	ClientNote: `${BASE_API_CLIENT_NOTE}`,
	ClientDocument: `${BASE_API_CLIENT_DOCUMENT}`,
	ClientRegion: `${BASE_API_CLIENT_REGION}`,
	ClientSite: `${BASE_API_CLIENT_SITE}`,
	clientUserSites: `${BASE_API_PATH_CLIENT_USER_SITES}`,
	ClientUserSitesApps: `${BASE_API_PATH_CLIENT_USER_SITES_APPS}`,

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
	sitekeycontacts: `${BASE_API_PATH_SITE_APP_KEY_CONTACTS}`,

	//site applications
	Applications: `${BASE_API_PATH_SITE_APPLICATIONS}`,
	SiteLocations: `${BASE_API_PATH_SITES_LOCATIONS}`,
	SiteDepartments: `${BASE_API_PATH_SITES_DEPARTMENTS}`,
	ApplicationPositions: `${BASE_API_PATH_APPLICATION_POSITIONS}`,

	//stop reasons
	StopReasons: `${BASE_API_PATH_STOP_REASONS}`,

	OperatingModes: `${BASE_API_PATH_OPERATING_MODES}`,
	ModelStatuses: `${BASE_API_PATH_MODEL_STATUSES}`,
	ModelTypes: `${BASE_API_PATH_MODEL_TYPES}`,
	defectStatuses: `${BASE_API_PATH_DEFECT_STATUSES}`,
	positions: `${BASE_API_PATH_POSITIONS}`,

	//skippedTasks
	SkippedTasks: `${BASE_API_PATH_SKIPPED_TASKS}`,

	//
	Pauses: `${BASE_API_PATH_PAUSES}`,

	//missingPartorToolReasons
	MissingPartorToolReasons: `${BASE_API_PATH_MISSING_PART_OR_TOOL_REASONS}`,

	//statusChanges
	StatusChanges: `${BASE_API_PATH_STATUS_CHANGES}`,

	//feedbackClassifications
	FeedbackClassifications: `${BASE_API_PATH_FEEDBACK_CLASSIFICATIONS}`,

	// feedbackStatuses
	FeedbackStatuses: `${BASE_API_PATH_FEEDBACK_STATUSES}`,

	//feedbackPriorities
	FeedbackPriorities: `${BASE_API_PATH_FEEDBACK_PRIORITIES}`,

	//actions
	Actions: `${BASE_API_PATH_ACTIONS}`,

	//systems
	Systems: `${BASE_API_PATH_SYSTEMS}`,

	//lubricants
	Lubricants: `${BASE_API_PATH_LUBRICANTS}`,

	//defecttypes
	DefectTypes: `${BASE_API_PATH_DEFECT_TYPES}`,

	//userroles
	Roles: `${BASE_API_PATH_ROLES}`,

	//defectRiskRatings
	DefectRiskRatings: `${BASE_API_PATH_DEFECT_RISK_RATINGS}`,

	ApplicationPortal: `${BASE_API_PATH_APPLICATION_PORTAL}`,
	ApplicationsAndSites: `${BASE_API_PATH_APPLICATIONS_AND_SITES}`,

	//models
	Models: `${BASE_API_PATH_MODEL_LIST}`,
	DuplicateModal: `${BASE_API_PATH_DUPLICATE_MODEL}`,
	ModelVersions: `${BASE_API_PATH_MODEL_VERSIONS}`,
	Versions: `${BASE_API_PATH_MODEL_VERSIONS_LIST}`,
	ModelImports: `${BASE_API_PATH_MODEL_IMPORTS}`,

	// Model Details
	ModelStages: `${BASE_API_PATH_MODEL_STAGES}`,
	ModelZones: `${BASE_API_PATH_MODEL_ZONES}`,
	ModelIntervals: `${BASE_API_PATH_MODEL_INTERVALS}`,

	ModelTaskList: `${BASE_API_PATH_MODEL_INTERVALS_TASK_LIST_NOS}`,

	ModelVersionIntervalInclude: `${BASE_API_PATH_MODEL_VERSION_INTERVAL_INCLUDES}`,
	ModelQuestions: `${BASE_API_PATH_MODEL_QUESTIONS}`,
	ModelQuestionRole: `${BASE_API_PATH_MODEL_QUESTION_ROLE}`,
	ModelQuestionOption: `${BASE_API_PATH_MODEL_QUESTION_OPTION}`,
	ModelAssets: `${BASE_API_PATH_MODEL_ASSETS}`,
	ModelRoles: `${BASE_API_PATH_MODEL_ROLES}`,
	ModelVersionDepartments: `${BASE_API_PATH_MODEL_VERSION_DEPARTMENTS}`,
	ModelNotes: `${BASE_API_PATH_MODEL_NOTES}`,
	ModelDocuments: `${BASE_API_PATH_MODEL_DOCUMENTS}`,
	ModelTasks: `${BASE_API_PATH_MODEL_TASKS}`,
	ModelTaskQuestions: `${BASE_API_PATH_MODEL_TASKS_QUESTIONS}`,
	ModelTaskQuestionOptions: `${BASE_API_PATH_MODEL_TASKS_QUESTION_OPTIONS}`,

	ModelVersionTaskArrangements: `${BASE_API_PATH_MODEL_VERSION_TASK_ARRANGEMENT}`,
	ModelTaskStages: `${BASE_API_PATH_MODEL_TASKS_STAGES}`,
	ModelTaskZones: `${BASE_API_PATH_MODEL_TASK_ZONES}`,
	ModelVersionTaskIntervals: `${BASE_API_PATH_MODEL_VERSION_TASK_INTERVAL}`,
	ModelTaskNotes: `${BASE_API_PATH_MODEL_TASK_NOTES}`,
	ModelVersionArrangements: `${BASE_API_PATH_MODEL_VERSION_ARRANGMENTS}`,
	ModelVersionTaskRoles: `${BASE_API_PATH_MODEL_VERSION_TASK_ROLES}`,
	ModelVersionTaskParts: `${BASE_API_PATH_MODEL_TASK_PARTS}`,
	ModelVersionTaskImages: `${BASE_API_PATH_MODEL_TASK_IMAGES}`,
	ModelVersionTaskTools: `${BASE_API_PATH_MODEL_TASK_TOOLS}`,
	ModelVersionTaskPermits: `${BASE_API_PATH_MODEL_TASK_PERMITS}`,
	ModelVersionTaskAttachments: `${BASE_API_PATH_MODEL_TASK_ATTACHMENTS}`,
	ModelsPublished: `${BASE_API_PATH_MODELS_PUBLISHED}`,

	//Users
	ClientUserSiteApps: `${BASE_API_PATH_CLIENTUSERSITEAPPS}`,
	ClientSites: `${BASE_API_PATH_USER_SITEs}`,
	ClientUserSites: `${BASE_API_PATH_CLIENT_USER_SITES}`,
	ClientUserSiteAppServiceDeparments: `${BASE_API_PATH_CLIENT_USER_SITE_APP_SERVICE_DEPARTMENTS}`,
	ClientUserSiteAppServiceRoles: `${BASE_API_PATH_CLIENT_USER_SITE_APP_SERVICE_ROLES}`,
	ClientUserSiteAppServiceModels: `${BASE_API_PATH_CLIENT_USER_SITE_APP_SERVICE_MODELS}`,
	// Application Details
	Application: `${BASE_API_PATH_APPLICATIONS}`,

	// Services
	Services: `${BASE_API_PATH_SERVICES}`,
	ServiceNotes: `${BASE_API_PATH_SERVICES_NOTES}`,

	// Defects
	Defects: `${BASE_API_PATH_DEFECTS}`,
	DefectsSearch: `${BASE_API_PATH_DEFECTS_SEARCH}`,
	DefectAutocomplete: `${BASE_API_PATH_DEFECTS_AUTOCOMPLETE}`,
	DefectNotes: `${BASE_API_PATH_DEFECT_NOTES}`,
	DefectImages: `${BASE_API_PATH_DEFECT_IMAGES}`,
	DefectParts: `${BASE_API_PATH_DEFECT_PARTS}`,

	// Feedback
	Feedback: `${BASE_API_PATH_FEEDBACK}`,
	FeedbackNotes: `${BASE_API_PATH_FEEDBACK_NOTES}`,
	FeedbackImages: `${BASE_API_PATH_FEEDBACK_IMAGES}`,

	// NoticeBoards
	NoticeBoards: `${BASE_API_PATH_NOTICE_BOARDS}`,
	NoticeboardDepartments: `${BASE_API_PATH_NOTICE_BOARDS_DEPARTMENTS}`,

	//Analytics
	Analytics: `${BASE_API_PATH_ANALYTICS}`,
	//history
	modelhistorydetail: `${BASE_API_PATH_HISTORY_MODEL_DETAILS}`,
	modelhistoryassets: `${BASE_API_PATH_HISTORY_MODEL_ASSETS}`,
	modelhistoryarrangement: `${BASE_API_PATH_HISTORY_MODEL_ARRANGEMENTS}`,
	modelhistorystages: `${BASE_API_PATH_HISTORY_MODEL_STAGES}`,
	modelhistoryzones: `${BASE_API_PATH_HISTORY_MODEL_ZONES}`,
	modelhistoryinterval: `${BASE_API_PATH_HISTORY_MODEL_INTERVAL}`,
	modelhistoryrole: `${BASE_API_PATH_HISTORY_MODEL_ROLES}`,
	modelhistorytasks: `${BASE_API_PATH_HISTORY_MODEL_TASKS}`,
	modelhistoryquestions: `${BASE_API_PATH_HISTORY_MODEL_QUESTIONS}`,

	serviceDetailHistory: `${BASE_API_PATH_HISTORY_SERVICE_DETAILS}`,
	defectsHistory: `${BASE_API_PATH_HISTORY_DEFECTS}`,
	feedbacksHistory: `${BASE_API_PATH_HISTORY_FEEDBACK}`,
	clientUserSitesHistory: `${BASE_API_PATH_HISTORY_USER}`,
	clientDetails: `${BASE_API_PATH_HISTORY_CLIENTDETAILS}`,
	superAdminUserHistory: `${BASE_API_PATH_HISTORY_USERADMIN}`,
	noticeBoardsHistory: `${BASE_API_PATH_HISTORY_NOTICEBOARD}`,
	siteSettingsHistory: `${BASE_API_PATH_HISTORY_SITE_SETTINGS}`,
	siteAssetsHistory: `${BASE_API_PATH_HISTORY_SITE_ASSETS}`,
	siteDepartmentsHistory: `${BASE_API_PATH_HISTORY_SITE_DEPARTMENTS}`,

	siteAppFeedbackStatus: `${BASE_API_PATH_HISTORY_SITEAPP_FEEDBACK_STATUSES}`,
	siteAppFeedbackPriorities: `${BASE_API_PATH_HISTORY_SITEAPP_FEEDBACK_PRIORITIES}`,
	siteAppFeedbackClassifications: `${BASE_API_PATH_HISTORY_SITEAPP_FEEDBACK_CLASSIFICATIONS}`,
	siteAppDefectTypes: `${BASE_API_PATH_HISTORY_SITEAPP_DEFECT_TYPES}`,
	siteAppDefectStatuses: `${BASE_API_PATH_HISTORY_SITEAPP_DEFECT_STATUSES}`,
	siteAppDefectRiskRatings: `${BASE_API_PATH_HISTORY_SITEAPP_DEFECT_RISKRATINGS}`,
	siteAppRoles: `${BASE_API_PATH_HISTORY_SITEAPP_ROLES}`,
	siteAppPositions: `${BASE_API_PATH_HISTORY_SITEAPP_POSITIONS}`,
	siteAppLubricants: `${BASE_API_PATH_HISTORY_SITEAPP_LUBRICANTS}`,
	siteAppOperatingModes: `${BASE_API_PATH_HISTORY_SITEAPP_OPERATING_MODES}`,
	siteAppSystems: `${BASE_API_PATH_HISTORY_SITEAPP_SYSTEMS}`,
	siteAppActions: `${BASE_API_PATH_HISTORY_SITEAPP_ACTIONS}`,
	siteAppModelTypes: `${BASE_API_PATH_HISTORY_SITEAPP_MODEL_TYPES}`,
	siteAppModelStatuses: `${BASE_API_PATH_HISTORY_SITEAPP_MODEL_STATUSES}`,
	siteAppChangeStatusReasons: `${BASE_API_PATH_HISTORY_SITEAPP_CHANGE_STATUS_REASONS}`,
	siteAppMissingPartToolReasons: `${BASE_API_PATH_HISTORY_SITEAPP_MISSING_PART_TOOL_REASONS}`,
	siteAppSkipReasons: `${BASE_API_PATH_HISTORY_SITEAPP_SKIP_REASONS}`,
	siteAppStopReasons: `${BASE_API_PATH_HISTORY_SITEAPP_STOP_REASONS}`,
	siteAppPauseReasons: `${BASE_API_PATH_HISTORY_SITEAPP_PAUSE_REASONS}`,
	siteAppDetails: `${BASE_API_PATH_HISTORY_SITEAPP_DETAILS}`,
	appDetails: `${BASE_API_PATH_HISTORY_APP_DETAILS}`,
	appPauseReason: `${BASE_API_PATH_HISTORY_APP_PAUSE_REASON}`,
	appStopReason: `${BASE_API_PATH_HISTORY_APP_STOP_REASON}`,
	appSkipReason: `${BASE_API_PATH_HISTORY_APP_SKIP_REASON}`,
	appMissingPartToolReason: `${BASE_API_PATH_HISTORY_APP_MISSING_PART_TOOL_REASON}`,
	appChangeStatusReason: `${BASE_API_PATH_HISTORY_APP_CHANGE_STATUS_REASON}`,
	appChangeModelStatus: `${BASE_API_PATH_HISTORY_APP_MODEL_STATUSES}`,
	appChangeModelTypes: `${BASE_API_PATH_HISTORY_APP_MODEL_TYPES}`,
	appActions: `${BASE_API_PATH_HISTORY_APP_ACTIONS}`,
	appSystems: `${BASE_API_PATH_HISTORY_APP_SYSTEMS}`,
	appOperaingModes: `${BASE_API_PATH_HISTORY_APP_OPERATING_MODES}`,
	appPositions: `${BASE_API_PATH_HISTORY_APP_POSITIONS}`,
	appRoles: `${BASE_API_PATH_HISTORY_APP_ROLES}`,
	appDefectRiskRatings: `${BASE_API_PATH_HISTORY_APP_DEFECT_RISK_RATINGS}`,
	appDefectStatuses: `${BASE_API_PATH_HISTORY_APP_DEFECT_STATUSES}`,
	appDefectTypes: `${BASE_API_PATH_HISTORY_APP_DEFECT_TYPES}`,
	appFeedbackClassifications: `${BASE_API_PATH_HISTORY_APP_FEEDBACK_CLASSIFICATIONS}`,
	appFeedbackPriorities: `${BASE_API_PATH_HISTORY_APP_FEEDBACK_PRIORITIES}`,
	appFeedbackStatuses: `${BASE_API_PATH_HISTORY_APP_FEEDBACK_STATUSES}`,

	//Reports
	Reports: `${BASE_API_PATH_REPORTING}`,
};
