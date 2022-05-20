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
	H: "Checkout Out",
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
			return "Checkout Out";
		case "H":
			return "Checkout Out";

		default:
			break;
	}
};

export const serviceTableHeader = (allowIndividualAssetModels) => {
	return allowIndividualAssetModels === true
		? [
				{ id: 1, name: "Work Order" },
				{ id: 2, name: "Status" },
				{ id: 3, name: "% Completed", width: "200px" },
				{ id: 5, name: "% Time Under/Over" },
				{ id: 6, name: "Time (Mins) Under/Over" },
				{ id: 7, name: "Mins Remaining" },
				{ id: 8, name: "Model" },
				{ id: 9, name: "Asset Number" },
				{ id: 10, name: "Model Type" },
				{ id: 11, name: "Interval" },
				{ id: 12, name: "Role" },
				{ id: 13, name: "Scheduled Date/Time" },
				{ id: 14, name: "Current User" },
				{ id: 15, name: "Service Started" },
		  ]
		: [
				{ id: 1, name: "Work Order" },
				{ id: 2, name: "Status" },
				{ id: 3, name: "% Completed", width: "200px" },
				{ id: 5, name: "% Time Under/Over" },
				{ id: 6, name: "Time (Mins) Under/Over" },
				{ id: 7, name: "Mins Remaining" },
				{ id: 8, name: "Model" },
				{ id: 10, name: "Model Type" },
				{ id: 11, name: "Interval" },
				{ id: 12, name: "Role" },
				{ id: 13, name: "Scheduled Date/Time" },
				{ id: 14, name: "Current User" },
				{ id: 15, name: "Service Started" },
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
				"modelTemplateType",
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
				"modelTemplateType",
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

export const filterByDateOptions = (todayDate) => [
	{ id: "", name: "Show All", fromDate: "", toDate: "" },
	{
		id: 1,
		name: "Today",
		fromDate: convertDateToUTC(
			new Date(
				todayDate.getFullYear(),
				todayDate.getMonth(),
				todayDate.getDate()
			)
		),
		toDate: convertDateToUTC(
			new Date(
				todayDate.getFullYear(),
				todayDate.getMonth(),
				todayDate.getDate() + 1
			)
		),
	},
	{
		id: 2,
		name: "Last Week",
		fromDate: convertDateToUTC(
			new Date(
				todayDate.getFullYear(),
				todayDate.getMonth(),
				todayDate.getDate() - 7 - todayDate.getDay() + 1
			)
		),
		toDate: convertDateToUTC(
			new Date(
				todayDate.getFullYear(),
				todayDate.getMonth(),
				todayDate.getDate() - 7 + 7 - todayDate.getDay() + 1
			)
		),
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
		toDate: convertDateToUTC(
			new Date(
				todayDate.getFullYear(),
				todayDate.getMonth(),
				todayDate.getDate()
			)
		),
	},
	{
		id: 4,
		name: "Last Month",
		fromDate: convertDateToUTC(
			new Date(todayDate.getFullYear(), `${todayDate.getMonth() - 1}`)
		),
		toDate: convertDateToUTC(
			new Date(todayDate.getFullYear(), `${todayDate.getMonth()}`)
		),
	},
	{
		id: 5,
		name: "Last Year",
		fromDate: convertDateToUTC(new Date(`${todayDate.getFullYear() - 1}`, 0)),
		toDate: convertDateToUTC(new Date(`${todayDate.getFullYear() - 1}`, 12)),
	},
	{
		id: 6,
		name: "Future Services",
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
