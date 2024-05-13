import {
	siteDetailPath,
	siteAssetPath,
	siteDepartmentPath,
	modelDetail,
	modelStages,
	modelZones,
	modelIntervals,
	modelRoles,
	modelQuestions,
	modelTask,
	modelServiceLayout,
	modelAssest,
	analysisPath,
	defectsPath,
	feedbackPath,
	modelsPath,
	servicesPath,
	usersPath,
} from "helpers/routePaths";

export const BASE_API_PATH = "/api/";

export const clientOptions = [
	{ label: "Total Users", value: 1 }, //0
	{ label: "Concurrent Users", value: 2 }, //1
	{ label: "Per Role / Work Order", value: 3 }, //2
	{ label: "Site-Based Licencing", value: 4 }, //3
];

export const shareModelsOptions = [
	{ label: "No Sharing", value: 0 }, //0
	{ label: "Client: Site to Site", value: 1 }, //1
	{ label: "Client to Client Site", value: 2 }, //2
];

export const siteSettingShareModelsOptions = [
	{
		label:
			"You have the option to share models that you have built to another one of your sites listed within this client register. You will require access to these sites in order to share a model.",
		value: 1,
	}, //1
	{
		label:
			"You have the option to share models that you have built to other clients. You will require access to these clients and sites in order to share a model.",
		value: 2,
	}, //2
];
export const siteOptions = [
	{ label: "Total Users", value: 1 }, //0
	{ label: "Concurrent Users", value: 2 }, //1
	{ label: "Per Role / Work Order", value: 3 }, //2
	{ label: "Application-Based Licencing", value: 5 }, //3
];

export const siteApplicationOptions = [
	{ label: "Total Users", value: 1 }, //0
	{ label: "Concurrent Users", value: 2 }, //1
	{ label: "Per Role / Work Order", value: 3 }, //2
];

export const HistoryInfo = {
	1: { icon: "historyadd", type: "added" },
	2: { icon: "historyupdate", type: "edited" },
	3: { icon: "historydelete", type: "deleted" },
};

export const SubTableModelTask = (customCaptions) => ({
	76: customCaptions["stage"],
	77: customCaptions["zone"],
	78: customCaptions["role"],
	79: customCaptions["interval"],
	80: customCaptions["part"],
	81: customCaptions["tool"],
	82: customCaptions["permit"],
	83: "Image",
	84: "Attachment",
	85: customCaptions["question"],
});

export const HistoryEntityCaptions = (customCaptions) => ({
	0: "Application",
	1: "Model Status",
	2: "Pause Reason",
	3: "Pause Subcategory",
	4: "Position",
	5: "Action",
	6: "Model Type",
	7: "System",
	8: "Operating Mode",
	9: "Role",
	10: "Defect Type",
	11: "Defect Status",
	12: "Defect Risk Rating",
	13: "Feedback Status",
	14: "Feedback Priority",
	15: "Feedback Classification",
	16: "Missing Part/Tool Reason",
	17: "Skip Task Reason",
	18: "Stop Reason",
	19: "Change Status Reason",
	20: "User",
	21: "Client",
	22: "Client Note",
	23: "Client Application",
	24: "Client Document",
	25: "Region",
	26: "Site",
	28: `Site ${customCaptions?.["department"] || "Department"}`,
	29: `Site ${customCaptions?.["asset"] || "Asset"}`,
	30: "Site Application",
	31: customCaptions?.["pauseReason"],
	32: `${customCaptions?.["pauseReason"]} Subcategory`,
	33: `Missing ${customCaptions?.["part"]}/${customCaptions?.["tool"]} Reason`,
	36: customCaptions?.["skipReason"],
	37: customCaptions?.["stopReason"],
	38: "Change Status Reason",
	39: `${customCaptions?.["model"]} Status`,
	40: `${customCaptions?.["model"]} Type`,
	41: customCaptions?.["actionRequired"],
	42: customCaptions?.["system"],
	43: customCaptions?.["operatingMode"],
	45: customCaptions?.["role"],
	46: customCaptions?.["position"],
	47: `${customCaptions?.["defect"]} ${customCaptions?.["riskRating"]}`,
	48: customCaptions?.["defectStatus"],
	49: customCaptions?.["defectType"],
	50: `${customCaptions?.["feedback"]} ${customCaptions?.["classification"]}`,
	51: `${customCaptions?.["feedback"]} ${customCaptions?.["priority"]}`,
	52: customCaptions?.["feedbackStatus"],
	53: "Site Application Key Contact",
	54: "Client User",
	56: customCaptions?.["user"],
	61: `${customCaptions?.["model"]} Version`,
	64: customCaptions?.["asset"],
	65: customCaptions?.["stage"],
	66: customCaptions?.["zone"],
	67: customCaptions?.["interval"],
	68: customCaptions?.["role"],
	69: customCaptions?.["question"],
	70: customCaptions?.["task"],
	71: customCaptions?.["taskListNo"],
	76: `${customCaptions?.["task"]} ${customCaptions?.["stage"]}`,
	77: `${customCaptions?.["task"]} ${customCaptions?.["zone"]}`,
	78: `${customCaptions?.["task"]} ${customCaptions?.["role"]}`,
	79: `${customCaptions?.["task"]} ${customCaptions?.["interval"]}`,
	80: `${customCaptions?.["task"]} ${customCaptions?.["part"]}`,
	81: `${customCaptions?.["task"]} ${customCaptions?.["tool"]}`,
	82: `${customCaptions?.["task"]} ${customCaptions?.["permit"]}`,
	83: `${customCaptions?.["task"]} Image`,
	84: `${customCaptions?.["task"]} Attachment`,
	85: `${customCaptions?.["task"]} ${customCaptions?.["question"]}`,
	94: customCaptions?.["service"],
	102: `${customCaptions?.["service"]} Note`,
	106: customCaptions?.["noticeboard"] || "Noticeboard",
	107: customCaptions?.["feedback"],
	108: `${customCaptions?.["feedback"]} Note`,
	109: `${customCaptions?.["feedback"]} Image`,
	110: customCaptions?.["defect"],
	111: `Note`,
	112: `Image`,
	113: customCaptions?.["part"],
	116: customCaptions?.["arrangement"],
});

export const HistoryCaptions = {
	services: "services",
	modelVersionQuestions: "modelVersionQuestions",
	defects: "defects",
	clientUserSite: "clientUserSite",
	feedback: "feedback",
	noticeBoard: "noticeBoard",
	modelVersionTasks: "modelVersionTasks",
	modelVersionRoles: "modelVersionRoles",
	modelVersionIntervals: "modelVersionIntervals",
	modelVersionZones: "modelVersionZones",
	modelVersionStages: "modelVersionStages",
	modelVersionArrangements: "modelVersionArrangements",
	modelAssets: "modelAssets",
	modelVersions: "modelVersions",
};

export const HistoryCustomCaption = (from, customCaptions, showParts) => {
	console.log("from", from);
	switch (from) {
		case HistoryCaptions.modelVersions:
			return {
				Version: "Version",
				ModelStatusId: `${customCaptions?.["Model"]} Status`,
				Name: customCaptions?.["Make"],
				Model: customCaptions?.["Model"],
				ModelTypeID: `${customCaptions?.["modelType"]}`,
				SerialNumberRange: `${customCaptions?.["serialNumberRange"]}`,
				ShowTimer: "Show Timer",
				AllowTickAllPartsTools: `All Tick All for ${
					showParts ? `${customCaptions?.["partPlural"]} and` : ""
				} ${customCaptions?.["toolPlural"]} `,
				ListPartsToolsByStageZone: `List ${
					showParts ? `${customCaptions?.["partPlural"]} /` : ""
				} ${customCaptions?.["toolPlural"]} by ${customCaptions?.["stage"]} / ${
					customCaptions?.["zone"]
				}`,
				HideParts: `Hide ${customCaptions?.["partPlural"]}`,
				HideTools: `Hide ${customCaptions?.["toolPlural"]}`,
				IsPublished: "Published",
				EnableIntervalAutoInclude: `Enable ${customCaptions?.["interval"]} Auto-Include`,
				ReviewDate: "Review Date",
			};

		case HistoryCaptions.modelAssets:
			return {
				siteAssetID: `Site ${customCaptions?.["asset"]}`,
				IsActive: "Is Active",
			};

		case HistoryCaptions.modelVersionArrangements:
			return {
				Name: "Name",
			};
		case HistoryCaptions.modelVersionStages:
			return {
				Name: "Name",
				HasZones: `Has ${customCaptions?.["zonePluralz"]}`,
			};
		case HistoryCaptions.modelVersionZones:
			return {
				Name: "Name",
			};
		case HistoryCaptions.modelVersionIntervals:
			return {
				Name: "Name",
			};
		case HistoryCaptions.modelVersionRoles:
			return {
				Name: "Name",
				RoleID: `${customCaptions?.["role"]}`,
				SiteDepartmentID: `${customCaptions?.["department"]}`,
			};
		case HistoryCaptions.modelVersionQuestions:
			return {
				ModelVersionStageID: `${customCaptions?.["stage"]}`,
				ModelVersionZoneID: `${customCaptions?.["zone"]}`,
				IsCompulsory: "Is Compulsory",
				Caption: "Caption",
				Timing: "Timing",
				Type: "Type",
				DecimalPlaces: "Decimal Places",
				CheckboxCaption: "Checkbox Caption",
			};
		case HistoryCaptions.modelVersionTasks:
			return {
				ActionID: `${customCaptions?.["actionRequired"]}`,
				OperatingModeID: `${customCaptions?.["operatingMode"]}`,
				SystemID: `${customCaptions?.["system"]}`,
				LubricantID: `${customCaptions?.["lubricant"]}`,
				Name: "Name",
				SafetyCritical: `${customCaptions?.["safetyCritical"]}`,
				EstimatedMinutes: "Estimated Minutes",
				NotSkippable: `Cannot Skip ${customCaptions?.["taskPlural"]}`,
				LubricantVolume: `${customCaptions?.["lubricant"]} Volume`,
				LubricantUOM: `${customCaptions?.["lubricant"]} Unit Of Measure`,
				Purpose: `${customCaptions?.["purpose"]}`,
				Procedure: `${customCaptions?.["procedure"]}`,
				PossibleHazards: `${customCaptions?.["possibleHazardsPlural"]}`,
				AdditionalPPE: `${customCaptions?.["additionalPPE"]}`,
				Specification: `${customCaptions?.["specification"]}`,
				ContaminationControl: `${customCaptions?.["contaminationControls"]}`,
				OtherInformation: `${customCaptions?.["otherInformation"]}`,
				CorrectiveActions: `${customCaptions?.["correctiveActionsPlural"]}`,
				CustomField1: `${customCaptions?.["customField1"]}`,
				CustomField2: `${customCaptions?.["customField2"]}`,
				CustomField3: `${customCaptions?.["customField3"]}`,
				Controls: `${customCaptions?.["controlsPlural"]}`,
				Isolations: `${customCaptions?.["isolationsPlural"]}`,
			};

		case HistoryCaptions.defects:
			return {
				ModelID: `${customCaptions?.["model"]}`,
				ModelVersionStageID: `${customCaptions?.["stage"]}`,
				ModelVersionZoneID: `${customCaptions?.["zone"]}`,
				ServiceID: `${customCaptions?.["service"]}`,
				SiteDepartmentID: `${customCaptions?.["department"]}`,
				ServiceTaskID: `${customCaptions?.["task"]}`,
				ServiceTaskQuestionID: `${customCaptions?.["task"]} ${customCaptions?.["question"]}`,
				SiteAssetID: `${customCaptions?.["asset"]}`,
				SiteAssetReferenceID: `${customCaptions?.["assetReference"]}`,
				DefectRiskRatingID: `${customCaptions?.["riskRating"]}`,
				DefectStatusID: `${customCaptions?.["defectStatus"]}`,
				DefectTypeID: `${customCaptions?.["defectType"]}`,
				WorkOrder: `${customCaptions?.["defectWorkOrder"]}`,
				Details: `Details`,
			};

		case HistoryCaptions.clientUserSite:
			return {
				Active: "Is Active",
				AllowAllModels: `Allow All ${customCaptions?.["modelPlural"]}`,
				PositionID: `${customCaptions?.["position"]}`,
			};

		case HistoryCaptions.services:
			return {
				ModelID: `${customCaptions?.["model"]}`,
				WorkOrder: `${customCaptions?.["serviceWorkOrder"]}`,
				ModelVersionIntervalID: `${customCaptions?.["interval"]}`,
				ModelVersionArrangementID: `${customCaptions?.["arrangement"]}`,
				ModelVersionRoleID: `${customCaptions?.["role"]}`,
				SiteDepartmentID: `${customCaptions?.["department"]}`,
				SiteAssetID: `${customCaptions?.["asset"]}`,
				Status: `Status`,
				ScheduledDate: `Scheduled Date`,
				StartDate: `Start Date`,
				CompletedDate: `Completed Date`,
				NotificationNumber: `Notification Number`,
				ClientName: `Client Name`,
			};

		case HistoryCaptions.feedback:
			return {
				FeedbackClassificationID: `${customCaptions?.["classification"]}`,
				FeedbackPriorityID: `${customCaptions?.["priority"]}`,
				FeedbackStatusID: `${customCaptions?.["feedbackStatus"]}`,
				ModelID: `${customCaptions?.["model"]}`,
				ModelVersionStageID: `${customCaptions?.["stage"]}`,
				ModelVersionZoneID: `${customCaptions?.["zone"]}`,
				ModelVersionTaskID: ` ${customCaptions?.["task"]}`,
				AssignUserID: ` Assign ${customCaptions?.["user"]}`,
				AssignPositionID: `${customCaptions?.["position"]}`,
				SiteDepartmentID: `${customCaptions?.["department"]}`,
				SiteAssetID: `${customCaptions?.["asset"]}`,
				ChangeRequired: `${customCaptions?.["changeRequired"]}`,
				Benefit: `${customCaptions?.["benefit"]}`,
			};
		case HistoryCaptions.noticeBoard:
			return {
				Name: "Name",
				Description: "Description",
				Link: "Link",
				ExpiryDate: "Expiry Date",
			};
		default:
			return;
	}
};

export const HistoryProperty = {
	serviceStatus: "serviceStatus",
	questionType: "questionType",
	questionTiming: "questionTiming",
};

export const HistoryPropertyCode = (from, customCaptions) => {
	switch (from) {
		case HistoryProperty.questionTiming:
			return {
				B: `Beginning of ${customCaptions["service"]}`,
				E: `End of ${customCaptions["service"]}`,
				S: `Beginning of ${customCaptions["stage"]}`,
				Z: `Beginning of ${customCaptions["zone"]}`,
			};
		case HistoryProperty.questionType:
			return {
				S: "Short Text",
				B: "Boolean",
				N: "Number",
				L: "Long Text",
				T: "Time",
				D: "Date",
				O: "Dropdown List",
				C: "List",
			};
		case HistoryProperty.serviceStatus:
			return {
				T: `Stopped`,
				I: "In Progress",
				C: "Complete",
				X: "Cancelled",
				H: "Checked Out",
				M: "Incomplete",
				P: "Completed by Paper",
				S: "Scheduled",
			};
		default:
			return;
	}
};

export const DETAILS = "Details";
export const ASSETS = "Assets";
export const DEPARTMENTS = "Departments";

export const siteScreenNavigation = [
	{ name: DETAILS, url: `/${siteDetailPath}` },
	{ name: ASSETS, url: siteAssetPath },
	{ name: DEPARTMENTS, url: siteDepartmentPath },
];

export const modelScreenNavigation = ({
	assests,
	stages,
	zones,
	intervals,
	roles,
	questions,
	tasks,
}) => [
	{ name: "Details", url: modelDetail },
	{ name: `Assests(${assests})`, url: modelAssest },
	{ name: `Stages(${stages})`, url: modelStages },
	{ name: `Zones(${zones})`, url: modelZones },
	{ name: `Intervals(${intervals})`, url: modelIntervals },
	{ name: `Roles(${roles})`, url: modelRoles },
	{ name: `Questions(${questions})`, url: modelQuestions },
	{ name: `Tasks(${tasks})`, url: modelTask },
	{ name: "Service Layout", url: modelServiceLayout },
];

export const defectStatusTypes = [
	{ label: "Outstanding", value: "O" },
	{ label: "Complete", value: "C" },
];

export const positionAccessTypes = {
	F: "Full",
	E: "Edit",
	R: "Read-Only",
	N: "None",
};

export const NoReadOnly = ["F", "E"];
export const AccessTypes = {
	Full: "F",
	Edit: "E",
	"Read-Only": "R",
	None: "N",
};

export const DefaultPageOptions = (cc) => {
	return {
		6: "Analytics",
		5: cc?.defectPlural ?? "Defects",
		2: cc?.feedbackPlural ?? "Feedback",
		0: cc?.modelPlural ?? "Models",
		1: cc?.tutorialPlural ?? "Noticeboards",
		4: cc?.servicePlural ?? "Services",
		3: cc?.userPlural ?? "Users",
	};
};

export const defaultRedirect = {
	6: analysisPath,
	5: `/app/${defectsPath}`,
	2: `/app/${feedbackPath}`,
	0: `/app/${modelsPath}`,
	1: "/app/noticeboards",
	4: `/app/${servicesPath}`,
	3: `/app/{usersPath}`,
};

export const pageSize = {
	SMALL_SIZE: 15,
	MEDIUM_SIZE: 20,
	LARGE_SIZE: 25,
};

export const NotificationAlerts = {
	success: "#24BA78",
	error: "#E31212",
	info: "#307AD6",
	warning: "#ED8738",
};

export const workbookFields = (customCaptions) => [
	{ id: "1", name: "purpose", label: `${customCaptions.purpose}` },
	{ id: "2", name: "procedure", label: `${customCaptions.procedure}` },
	{
		id: "3",
		name: "possibleHazards",
		label: `${customCaptions.possibleHazardsPlural}`,
	},
	{
		id: "4",
		name: "additionalPPE",
		label: `${customCaptions.additionalPPE}`,
	},
	{
		id: "5",
		name: "specification",
		label: `${customCaptions.specification}`,
	},
	{
		id: "6",
		name: "contaminationControl",
		label: `${customCaptions.contaminationControlsPlural}`,
	},
	{
		id: "7",
		name: "otherInformation",
		label: `${customCaptions.otherInformation}`,
	},
	{
		id: "8",
		name: "correctiveActions",
		label: `${customCaptions.correctiveActionsPlural}`,
	},
	{
		id: "9",
		name: "isolations",
		label: `${customCaptions.isolationsPlural}`,
	},
	{ id: "10", name: "controls", label: `${customCaptions.controlsPlural}` },
	{ id: "11", name: "customField1", label: `${customCaptions.customField1}` },
	{ id: "12", name: "customField2", label: `${customCaptions.customField2}` },
	{ id: "13", name: "customField3", label: `${customCaptions.customField3}` },
];

export const DROPDOWN_TOP_OFFSET = 30;
export const DROPDOWN_LEFT_OFFSET = 30;
export const DROPDOWN_RIGHT_OFFSET = 30;

export const statusOptions = [
	{ id: "X", name: "Cancelled", groupBy: "Complete" },
	{ id: "C", name: "Complete", groupBy: "Complete" },
	{ id: "P", name: "Completed by Paper", groupBy: "Complete" },
	{ id: "H", name: "Checked Out", groupBy: "Not Complete" },
	{ id: "I", name: "In Progress", groupBy: "Not Complete" },
	{ id: "N", name: "Incomplete", groupBy: "Complete" },
	{ id: "S", name: "Scheduled", groupBy: "Not Complete" },
	{ id: "T", name: "Stopped", groupBy: "Not Complete" },
];

export const statusTypeClassification = { 1: "C", 2: "O" };

// defects storage
export const DEFECTS_STORAGE_STATUS = "defects-status";
export const DEFECTS_STORAGE_DEPARTMENT = "defects-department";
export const DEFECTS_STORAGE_TIMEFRAME = "defects-timeFrame";

// feedback storage
export const FEEDBACK_STORAGE_STATUS = "feedback-status";
export const FEEDBACK_STORAGE_DEPARTMENT = "feedback-department";
export const FEEDBACK_STORAGE_TIMEFRAME = "feedback-timeFrame";
export const FEEDBACK_STORAGE_MY_FEEDBACK = "feedback-myfeedback";

//service storage
export const SERVICE_STORAGE_STATUS = "service-status";
export const SERVICE_STORAGE_DEPARTMENT = "service-department";
export const SERVICE_STORAGE_TIMEFRAME = "service-timeFrame";

//model storage
export const MODEL_STORAGE_STATUS = "model-status";
export const MODEL_STORAGE_DEPARTMENT = "model-department";

export const REMOVE_SESSIONS = [
	SERVICE_STORAGE_TIMEFRAME,
	SERVICE_STORAGE_STATUS,
	SERVICE_STORAGE_DEPARTMENT,
	MODEL_STORAGE_STATUS,
	MODEL_STORAGE_DEPARTMENT,
	FEEDBACK_STORAGE_TIMEFRAME,
	FEEDBACK_STORAGE_STATUS,
	FEEDBACK_STORAGE_DEPARTMENT,
	DEFECTS_STORAGE_DEPARTMENT,
	DEFECTS_STORAGE_TIMEFRAME,
	DEFECTS_STORAGE_STATUS,
];

export const Months = [
	"Jan",
	"Feb",
	"Mar",
	"Apr",
	"May",
	"June",
	"July",
	"Aug",
	"Sep",
	"Oct",
	"Nov",
	"Dec",
];

//license type
export const LicenceType = (licenseLevel) => {
	switch (licenseLevel) {
		case "A":
			return "Application License";
		case "B":
			return "Site License";
		case "C":
			return "Client License";
		default:
			return "Unknown License";
	}
};
