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

const BASE_API_PATH_MODEL_TASKS_STAGES = `${BASE_API_PATH}ModelVersionTaskStages`;
const BASE_API_PATH_MODEL_ASSETS = `${BASE_API_PATH}ModelAssets`;
const BASE_API_PATH_MODEL_VERSION_TASK_INTERVAL = `${BASE_API_PATH}ModelVersionTaskIntervals`;

// Model Stages
const BASE_API_PATH_MODEL_STAGES = `${BASE_API_PATH}modelversionstages`;
const BASE_API_PATH_MODEL_INTERVALS = `${BASE_API_PATH}modelversionintervals`;

const BASE_API_PATH_MODEL_VERSION_INTERVAL_INCLUDES = `${BASE_API_PATH}modelversionintervalincludes`;

const BASE_API_PATH_MODEL_INTERVALS_TASK_LIST_NOS = `${BASE_API_PATH}ModelIntervalTaskListNos`;
//ModelDetails
const BASE_API_PATH_MODEL_DEPARTMENTS = `${BASE_API_PATH}ModelDepartments`;
const BASE_API_PATH_MODEL_NOTES = `${BASE_API_PATH}ModelNotes`;
const BASE_API_PATH_MODEL_DOCUMENTS = `${BASE_API_PATH}ModelDocuments`;

// Model Task Notes
const BASE_API_PATH_MODEL_TASK_NOTES = `${BASE_API_PATH}ModelTaskNotes`;

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

// Services
const BASE_API_PATH_SERVICES = `${BASE_API_PATH}services`;

// Services Notes
const BASE_API_PATH_SERVICES_NOTES = `${BASE_API_PATH}ServiceNotes`;

// Defects
const BASE_API_PATH_DEFECTS = `${BASE_API_PATH}Defects`;
const BASE_API_PATH_DEFECT_NOTES = `${BASE_API_PATH}DefectNotes`;
const BASE_API_PATH_DEFECT_IMAGES = `${BASE_API_PATH}DefectImages`;

// Feedback
const BASE_API_PATH_FEEDBACK = `${BASE_API_PATH}Feedback`;
const BASE_API_PATH_FEEDBACK_NOTES = `${BASE_API_PATH}FeedbackNotes`;
const BASE_API_PATH_FEEDBACK_IMAGES = `${BASE_API_PATH}FeedbackImages`;

export const Apis = {
	// register email
	RegisterEmail: `${BASE_API_PATH_REGISTER_USER_EMAIL}`,

	// forgotPassword
	ForgotPasswrod: `${BASE_API_PATH_FORGOT_PASSWORD}`,

	// resetPassword
	ResetPassword: `${BASE_API_PATH_RESET_PASSWORD}`,

	//users list
	UsersList: `${BASE_API_PATH_USERSLIST}`,

	//userDetails
	UserDetailsNote: `${BASE_API_PATH_USERDETAILSNOTE}`,
	UserDetailsNotePost: `${BASE_API_PATH_USERDETAILSNOTEPOST}`,
	UserDetailReference: `${BASE_API_PATH_USERREFERENCE}`,
	userDetailSites: `${BASE_API_PATH_USER_SITEs}`,

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
	ModelDepartments: `${BASE_API_PATH_MODEL_DEPARTMENTS}`,
	ModelNotes: `${BASE_API_PATH_MODEL_NOTES}`,
	ModelDocuments: `${BASE_API_PATH_MODEL_DOCUMENTS}`,
	ModelTasks: `${BASE_API_PATH_MODEL_TASKS}`,
	ModelTaskQuestions: `${BASE_API_PATH_MODEL_TASKS_QUESTIONS}`,
	ModelTaskQuestionOptions: `${BASE_API_PATH_MODEL_TASKS_QUESTION_OPTIONS}`,

	ModelTaskStages: `${BASE_API_PATH_MODEL_TASKS_STAGES}`,
	ModelTaskZones: `${BASE_API_PATH_MODEL_TASK_ZONES}`,
	ModelVersionTaskIntervals: `${BASE_API_PATH_MODEL_VERSION_TASK_INTERVAL}`,
	ModelTaskNotes: `${BASE_API_PATH_MODEL_TASK_NOTES}`,
	ModelVersionTaskRoles: `${BASE_API_PATH_MODEL_VERSION_TASK_ROLES}`,
	ModelVersionTaskParts: `${BASE_API_PATH_MODEL_TASK_PARTS}`,
	ModelVersionTaskImages: `${BASE_API_PATH_MODEL_TASK_IMAGES}`,
	ModelVersionTaskTools: `${BASE_API_PATH_MODEL_TASK_TOOLS}`,
	ModelVersionTaskPermits: `${BASE_API_PATH_MODEL_TASK_PERMITS}`,
	ModelVersionTaskAttachments: `${BASE_API_PATH_MODEL_TASK_ATTACHMENTS}`,

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
	DefectNotes: `${BASE_API_PATH_DEFECT_NOTES}`,
	DefectImages: `${BASE_API_PATH_DEFECT_IMAGES}`,

	// Feedback
	Feedback: `${BASE_API_PATH_FEEDBACK}`,
	FeedbackNotes: `${BASE_API_PATH_FEEDBACK_NOTES}`,
	FeedbackImages: `${BASE_API_PATH_FEEDBACK_IMAGES}`,
};
