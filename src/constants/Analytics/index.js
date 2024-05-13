import { endOfDay, startOfDay } from "helpers/date";
import { convertDateToUTC } from "helpers/utils";

export const filterByDateOptions = (todayDate) => [
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
		id: 4,
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
	{ id: 5, name: "Custom Range..." },
];

export const historyData = [
	{
		keyValue: 105,
		dateTime: "2023-01-24T03:35:13.5625019",
		userID: 9,
		user: "Users, Ashis",
		auditType: 2,
		oldValues: '{"IsDeleted":false}',
		newValues: '{"IsDeleted":true}',
		name: "HTK0317",
	},
	{
		keyValue: 105,
		dateTime: "2023-01-23T11:11:12.6748749",
		userID: 9,
		user: "Users, Ashis",
		auditType: 2,
		oldValues: '{"IsActive":true}',
		newValues: '{"IsActive":false}',
		name: "HTK0317",
	},
	{
		keyValue: 150,
		dateTime: "2023-01-20T10:25:18.1983797",
		userID: 9,
		user: "Users, Ashis",
		auditType: 1,
		oldValues: null,
		newValues: null,
		name: "Asset 10",
	},
	{
		keyValue: 149,
		dateTime: "2023-01-10T06:34:31.9350738",
		userID: 9,
		user: "Users, Ashis",
		auditType: 1,
		oldValues: null,
		newValues: null,
		name: "Asset 4",
	},
	{
		keyValue: 105,
		dateTime: "2022-12-07T06:59:57.7882638",
		userID: 9,
		user: "Users, Ashis",
		auditType: 2,
		oldValues: '{"IsActive":false}',
		newValues: '{"IsActive":true}',
		name: "HTK0317",
	},
	{
		keyValue: 105,
		dateTime: "2022-12-07T06:59:55.5132868",
		userID: 9,
		user: "Users, Ashis",
		auditType: 2,
		oldValues: '{"IsActive":true}',
		newValues: '{"IsActive":false}',
		name: "HTK0317",
	},
	{
		keyValue: 147,
		dateTime: "2022-12-07T06:44:32.9528744",
		userID: 9,
		user: "Users, Ashis",
		auditType: 1,
		oldValues: null,
		newValues: null,
		name: "First arrangement",
	},
	{
		keyValue: 105,
		dateTime: "2022-12-07T06:15:41.293327",
		userID: 9,
		user: "Users, Ashis",
		auditType: 2,
		oldValues: '{"IsActive":false}',
		newValues: '{"IsActive":true}',
		name: "HTK0317",
	},
	{
		keyValue: 105,
		dateTime: "2022-12-07T06:15:38.124703",
		userID: 9,
		user: "Users, Ashis",
		auditType: 2,
		oldValues: '{"IsActive":true}',
		newValues: '{"IsActive":false}',
		name: "HTK0317",
	},
	{
		keyValue: 119,
		dateTime: "2022-08-24T06:56:42.3395485",
		userID: 9,
		user: "Users, Ashis",
		auditType: 1,
		oldValues: null,
		newValues: null,
		name: "Asset 6",
	},
	{
		keyValue: 118,
		dateTime: "2022-08-24T06:56:33.3389124",
		userID: 9,
		user: "Users, Ashis",
		auditType: 1,
		oldValues: null,
		newValues: null,
		name: "Asset 1",
	},
	{
		keyValue: 105,
		dateTime: "2022-08-05T03:48:27.8889342",
		userID: 73,
		user: "User, User",
		auditType: 1,
		oldValues: null,
		newValues: null,
		name: "HTK0317",
	},
];

export const MONTHS = [
	"January",
	"February",
	"March",
	"April",
	"May",
	"June",
	"July",
	"August",
	"September",
	"October",
	"November",
	"December",
];
