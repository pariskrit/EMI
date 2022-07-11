import {
	serviceConditionMonitorning,
	serviceDefects,
	serviceImpact,
	serviceReport,
	serviceTimes,
} from "helpers/routePaths";
import ServiceDetailContent from "../Detail";
import Impacts from "../Impacts";
import Defects from "../Defects";
import Times from "../Times";
import ServiceReport from "../ServiceReport";
import ConditionMonitor from "../ConditionMonitor";

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
		component: Impacts,
		showSave: false,
		showChangeStatus: false,
		showSaveChanges: false,
		showPasteTask: false,
		showVersion: false,
	},
	{
		id: 3,
		ModelName: customCaptions?.defectPlural,
		name: customCaptions?.defectPlural,
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
		component: ConditionMonitor,
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
		component: Times,
		showSave: false,
		showChangeStatus: false,
		showSaveChanges: false,
		showPasteTask: false,
		showVersion: false,
	},
	{
		id: 6,
		ModelName: `${customCaptions?.service} Report`,
		name: `${customCaptions?.service} Report`,
		path: serviceReport,
		component: ServiceReport,
		showSave: false,
		showChangeStatus: false,
		showSaveChanges: false,
		showPasteTask: false,
		showVersion: false,
	},
];

export default routeList;
