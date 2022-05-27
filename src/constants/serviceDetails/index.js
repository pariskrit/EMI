import dayjs from "dayjs";
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

export const changeStatusReason = [
	{ id: "X", name: "Cancel", showIn: "S" },
	{ id: "C", name: "Complete", showIn: "T" },
	{ id: "N", name: "Incomplete", showIn: "T" },
	{ id: "P", name: "Completed by Paper", showIn: "S" },
];

export const mappeedStatusReason = {
	S: "X",
	name: "Cancel",
};

export const statusOfServices = (status, TasksSkipped) => {
	switch (status) {
		case "T":
			return TasksSkipped === false ? "Stopped" : "Stopped (Tasks Skipped)";
		case "X":
			return "Cancelled";
		case "N":
			return "Incomplete";
		case "S":
			return "Scheduled";
		case "C":
			return TasksSkipped === false ? "Complete" : "Complete (Tasks Skipped)";
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
	customCaptions
) => {
	return allowIndividualAssetModels === true
		? [
				{ id: 1, name: "Work Order" },
				{ id: 2, name: "Status" },
				{ id: 3, name: "% Completed", width: "200px" },
				{ id: 5, name: "% Time Under/Over" },
				{ id: 6, name: "Time (Mins) Under/Over" },
				{ id: 7, name: "Mins Remaining" },
				{ id: 8, name: customCaptions.model },
				{ id: 9, name: customCaptions.asset + " Number" },
				{ id: 10, name: customCaptions.modelType },
				{ id: 11, name: customCaptions.interval },
				{ id: 12, name: customCaptions.role },
				{ id: 13, name: "Scheduled Date/Time" },
				{ id: 14, name: "Current " + customCaptions.user },
				{ id: 15, name: customCaptions.service + " Started" },
		  ]
		: [
				{ id: 1, name: "Work Order" },
				{ id: 2, name: "Status" },
				{ id: 3, name: "% Completed", width: "200px" },
				{ id: 5, name: "% Time Under/Over" },
				{ id: 6, name: "Time (Mins) Under/Over" },
				{ id: 7, name: "Mins Remaining" },
				{ id: 8, name: customCaptions.model },
				{ id: 10, name: customCaptions.modelType },
				{ id: 11, name: customCaptions.interval },
				{ id: 12, name: customCaptions.role },
				{ id: 13, name: "Scheduled Date/Time" },
				{ id: 14, name: "Current " + customCaptions.user },
				{ id: 15, name: customCaptions.service + " Started" },
		  ];
};
export const serviceTableColumns = (allowIndividualAssetModels) => {
	return allowIndividualAssetModels === true
		? [
				"workOrder",
				"status",
				"percentageComplete",
				"percentageOverTime",
				"minutesOverTime",
				"estimatedMinutes",
				"modelName",
				"siteAssetName",
				"typeName",
				"interval",
				"role",
				"scheduledDate",
				"checkoutUser",
				"checkoutDate",
		  ]
		: [
				"workOrder",
				"status",
				"percentageComplete",
				"percentageOverTime",
				"minutesOverTime",
				"estimatedMinutes",
				"modelName",
				"typeName",
				"interval",
				"role",
				"scheduledDate",
				"checkoutUser",
				"checkoutDate",
		  ];
};

export const defaultTimeframe = {
	id: 3,
	name: "Last Fortnight",
	fromDate: convertDateToUTC(
		new Date(
			new Date().getFullYear(),
			new Date().getMonth(),
			new Date().getDate() - 14
		)
	),
	toDate: convertDateToUTC(new Date()),
};

export const showAllInDropDown = {
	id: "",
	name: "Show All",
};

export const filterByDateOptions = (todayDate, customCaptions) => [
	{ id: "", name: "Show All", fromDate: "", toDate: "" },
	{
		id: 1,
		name: "Today",
		fromDate: convertDateToUTC(new Date(dayjs().startOf("day"))),
		toDate: convertDateToUTC(new Date(dayjs().endOf("day"))),
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
		toDate: convertDateToUTC(new Date(dayjs().endOf("day"))),
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
		toDate: convertDateToUTC(new Date(dayjs().endOf("day"))),
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
		toDate: convertDateToUTC(new Date(dayjs().endOf("day"))),
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
		toDate: convertDateToUTC(new Date(dayjs().endOf("day"))),
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
