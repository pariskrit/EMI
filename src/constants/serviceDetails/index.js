import { endOfDay, startOfDay } from "helpers/date";
import { convertDateToUTC } from "helpers/utils";

export const redService = ["T", "X", "N", "S"];
export const greenService = ["C", "P", "I", "O"];

export const serviceStatus = {
	T: "Stopped",
	X: "Cancelled",
	N: "Incomplete",
	S: "Scheduled",
	C: "Complete",
	P: "Complete (By Paper)",
	I: "In Progress",
	O: "Checked Out",
	H: "Checked Out",
};

export const changeStatusReason = (customCaptions) => [
	{ id: "X", name: "Cancel", showIn: "S" },
	{
		id: "C",
		name: `Complete (${customCaptions?.taskPlural ?? "Tasks"} Skipped)`,
		showIn: "T",
	},
	{ id: "N", name: "Incomplete", showIn: "T" },
	{ id: "P", name: "Completed by Paper", showIn: "S" },
];

export const mappeedStatusReason = {
	S: "X",
	name: "Cancel",
};

export const statusOfServices = (status, TasksSkipped, customCaptions) => {
	switch (status) {
		case "T":
			return TasksSkipped === false
				? "Stopped"
				: `Stopped (${customCaptions?.taskPlural ?? "Tasks"} Skipped)`;
		case "X":
			return "Cancelled";
		case "N":
			return "Incomplete";
		case "S":
			return "Scheduled";
		case "C":
			return TasksSkipped === false
				? "Complete"
				: `Complete (${customCaptions?.taskPlural ?? "Tasks"} Skipped)`;
		case "P":
			return "Complete (By Paper)";
		case "I":
			return "In Progress";
		case "O":
			return "Checked Out";
		case "H":
			return "Checked Out";

		default:
			break;
	}
};

export const serviceTableHeader = (
	allowIndividualAssetModels,
	customCaptions,
	showServiceClientName
) => {
	return allowIndividualAssetModels === true
		? [
				{ id: 1, name: customCaptions.serviceWorkOrder },
				...(showServiceClientName ? [{ id: 16, name: "Client Name" }] : []),
				{ id: 8, name: customCaptions.model },
				{ id: 9, name: customCaptions.asset },
				{ id: 11, name: customCaptions.interval },
				{ id: 12, name: customCaptions.role },
				{ id: 2, name: "Status" },
				{ id: 3, name: "% Completed", width: "200px" },
				{ id: 5, name: "% Time Under/Over" },
				{ id: 6, name: "Time (Mins) Under/Over" },
				{ id: 7, name: "Mins Remaining" },

				{ id: 13, name: "Scheduled Date/Time" },
				{ id: 14, name: "Current " + customCaptions.user },
				{ id: 15, name: customCaptions.service + " Started" },
		  ]
		: [
				{ id: 1, name: "Work Order" },
				...(showServiceClientName ? [{ id: 16, name: "Client Name" }] : []),
				{ id: 8, name: customCaptions.model },
				{ id: 11, name: customCaptions.interval },
				{ id: 12, name: customCaptions.role },
				{ id: 2, name: "Status" },
				{ id: 3, name: "% Completed", width: "200px" },
				{ id: 5, name: "% Time Under/Over" },
				{ id: 6, name: "Time (Mins) Under/Over" },
				{ id: 7, name: "Mins Remaining" },
				{ id: 13, name: "Scheduled Date/Time" },
				{ id: 14, name: "Current " + customCaptions.user },
				{ id: 15, name: customCaptions.service + " Started" },
		  ];
};
export const serviceTableColumns = (
	allowIndividualAssetModels,
	showServiceClientName
) => {
	return allowIndividualAssetModels === true
		? [
				"workOrder",
				...(showServiceClientName ? ["clientName"] : []),
				"modelName",
				"siteAssetName",
				"interval",
				"role",
				"status",
				"percentageComplete",
				"percentageOverTime",
				"minutesOverTime",
				"estimatedMinutes",
				"scheduledDate",
				"checkoutUser",
				"checkoutDate",
		  ]
		: [
				"workOrder",
				...(showServiceClientName ? ["clientName"] : []),
				"modelName",
				"interval",
				"role",
				"status",
				"percentageComplete",
				"percentageOverTime",
				"minutesOverTime",
				"estimatedMinutes",
				"scheduledDate",
				"checkoutUser",
				"checkoutDate",
		  ];
};

export const defaultTimeframe = {
	id: "",
	name: "Show All",
	fromDate: "",
	toDate: "",
};

export const showAllInDropDown = {
	id: 2,
	name: "Not Complete",
	statusType: "O",
};

export const filterByDateOptions = (todayDate, customCaptions) => [
	{ id: "", name: "Show All", fromDate: "", toDate: "" },
	{
		id: 1,
		name: "Today",
		fromDate: convertDateToUTC(startOfDay()),
		toDate: convertDateToUTC(endOfDay()),
	},
	{
		id: 2,
		name: "Last Week",
		fromDate: convertDateToUTC(
			new Date(
				todayDate.getFullYear(),
				todayDate.getMonth(),
				todayDate.getDate() - 7
			)
		),
		toDate: convertDateToUTC(endOfDay()),
	},
	{
		id: 3,
		name: "Last Fortnight",
		fromDate: convertDateToUTC(
			new Date(
				todayDate.getFullYear(),
				todayDate.getMonth(),
				todayDate.getDate() - 14
			)
		),
		toDate: convertDateToUTC(endOfDay()),
	},
	{
		id: 4,
		name: "Last Month",
		fromDate: convertDateToUTC(
			new Date(
				todayDate.getFullYear(),
				todayDate.getMonth(),
				todayDate.getDate() - 30
			)
		),
		toDate: convertDateToUTC(endOfDay()),
	},
	{
		id: 5,
		name: "Last Year",
		fromDate: convertDateToUTC(
			new Date(
				todayDate.getFullYear(),
				todayDate.getMonth(),
				todayDate.getDate() - 365
			)
		),
		toDate: convertDateToUTC(endOfDay()),
	},
	{
		id: 6,
		name: "Future " + customCaptions?.servicePlural,
		fromDate: convertDateToUTC(
			new Date(
				todayDate.getFullYear(),
				todayDate.getMonth(),
				todayDate.getDate() + 1
			)
		),
		toDate: "",
	},
	{ id: 7, name: "Custom Range..." },
];

export const serviceMonitorQuestionHeader = (customCaptions, modelType) =>
	modelType === "F"
		? [
				{
					id: 1,
					name: customCaptions.stage,
				},
				{
					id: 2,
					name: customCaptions.zone,
				},
				{
					id: 3,
					name: customCaptions.task,
				},
				{
					id: 4,
					name: customCaptions.question,
				},
				{
					id: 5,
					name: customCaptions.asset,
				},
		  ]
		: [
				{
					id: 1,
					name: customCaptions.stage,
				},
				{
					id: 2,
					name: customCaptions.zone,
				},
				{
					id: 3,
					name: customCaptions.task,
				},
				{
					id: 4,
					name: customCaptions.question,
				},
		  ];

export const serviceMonitorQuestionCols = (modelType) =>
	modelType === "F"
		? [
				{ id: 1, name: "stageName" },
				{ id: 2, name: "zoneName" },
				{ id: 3, name: "taskName" },
				{ id: 4, name: "question" },
				{ id: 5, name: "siteAssetName" },
		  ]
		: [
				{ id: 1, name: "stageName" },
				{ id: 2, name: "zoneName" },
				{ id: 3, name: "taskName" },
				{ id: 4, name: "question" },
		  ];

export const serviceGarphId = "serviceganttchartid";
