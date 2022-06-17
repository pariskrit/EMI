import {
	siteDetailPath,
	siteAssetPath,
	siteDepartmentPath,
	siteLocationPath,
	modelDetail,
	modelStages,
	modelZones,
	modelIntervals,
	modelRoles,
	modelQuestions,
	modelTask,
	modelServiceLayout,
	modelAssest,
} from "helpers/routePaths";

export const BASE_API_PATH = "/api/";

export const clientOptions = [
	{ label: "Total Users", value: 0 },
	{ label: "Concurrent Users", value: 1 },
	{ label: "Per Role / Work Order", value: 2 },
	{ label: "Site-Based Licencing", value: 3 },
];

export const siteOptions = [
	{ label: "Total Users", value: 0 },
	{ label: "Concurrent Users", value: 1 },
	{ label: "Per Role / Work Order", value: 2 },
	{ label: "Application-Based Licencing", value: 3 },
];

export const siteApplicationOptions = [
	{ label: "Total Users", value: 0 },
	{ label: "Concurrent Users", value: 1 },
	{ label: "Per Role / Work Order", value: 2 },
];

export const siteScreenNavigation = [
	{ name: "Details", url: siteDetailPath },
	{ name: "Assets", url: siteAssetPath },
	{ name: "Departments", url: siteDepartmentPath },
	{ name: "Locations", url: siteLocationPath },
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
	{ label: "Notification Raised", value: "N" },
	{ label: "Complete", value: "C" },
];

// export const positionTypes = [
// 	{ label: "Full", value: "F" },
// 	{ label: "Edit", value: "E" },
// 	{ label: "Read-Only", value: "R" },
// 	{ label: "None", value: "N" },
// ];

export const positionAccessTypes = {
	F: "Full",
	E: "Edit",
	R: "Read-Only",
	N: "None",
};

export const DefaultPageSize = 12;

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
