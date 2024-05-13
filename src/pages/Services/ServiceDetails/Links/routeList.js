import {
	serviceConditionMonitorning,
	serviceDefects,
	serviceImpact,
	serviceReport,
	serviceTimes,
} from "helpers/routePaths";
import ServiceDetailContent from "pages/Services/ServiceDetails/Detail";
import Impacts from "pages/Services/ServiceDetails/Impacts";
import Defects from "pages/Services/ServiceDetails/Defects";
import Times from "pages/Services/ServiceDetails/Times";
import ServiceReport from "pages/Services/ServiceDetails/ServiceReport";
import ConditionMonitor from "pages/Services/ServiceDetails/ConditionMonitor";

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
		name: `${customCaptions?.defectPlural} (${detail?.defectCount || 0})`,
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
