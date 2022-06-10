import {
	serviceConditionMonitorning,
	serviceDefects,
	serviceImpact,
	serviceTimes,
} from "helpers/routePaths";
import ServiceDetailContent from "../Detail";
import Defects from "../Defects";

const routeList = (detail, customCaptions) => [
	{
		id: 1,
		ModelName: "Details",
		name: "Details",
		path: "",
		component: ServiceDetailContent,
		showSave: false,
		showChangeStatus: true,
		showSaveChanges: false,
		showPasteTask: false,
		showVersion: false,
	},
	{
		id: 2,
		ModelName: "Impacts",
		name: "Impacts",
		path: serviceImpact,
		component: ServiceDetailContent,
		showSave: false,
		showChangeStatus: false,
		showSaveChanges: false,
		showPasteTask: false,
		showVersion: false,
	},
	{
		id: 3,
		ModelName: "Defects",
		name: "Defects",
		path: serviceDefects,
		component: Defects,
		showSave: false,
		showChangeStatus: false,
		showSaveChanges: false,
		showPasteTask: false,
		showVersion: false,
	},
	{
		id: 4,
		ModelName: "Condition Monitoring",
		name: "Condition Monitoring",
		path: serviceConditionMonitorning,
		component: ServiceDetailContent,
		showSave: false,
		showChangeStatus: false,
		showSaveChanges: false,
		showPasteTask: false,
		showVersion: false,
	},
	{
		id: 5,
		ModelName: "Times",
		name: "Times",
		path: serviceTimes,
		component: ServiceDetailContent,
		showSave: false,
		showChangeStatus: false,
		showSaveChanges: false,
		showPasteTask: false,
		showVersion: false,
	},
];

export default routeList;
