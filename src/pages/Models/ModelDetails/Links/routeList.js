import ModelDetailContent from "../ModelDetail/ModelDetailContent";
import {
	modelAssest,
	modelRoles,
	modelZones,
	modelStages,
	modelQuestions,
	modelTask,
	modelServiceLayout,
	modelIntervals,
} from "helpers/routePaths";
import ModelAsset from "../ModelAsset";
import ModelStage from "../ModelStages";
import Roles from "../ModelRoles/Roles";
import Zones from "../ModelZones/Zones";
import ModelInterval from "../ModelIntervals";
import ModelQuestion from "../ModelQuestion";
import Task from "../ModelTasks/Task";
import ModelServiceLayout from "../ModelServiceLayout";

const routeList = (detail, customCaptions) => [
	{
		id: 1,
		ModelName: "Details",
		name: "Details",
		path: "",
		component: ModelDetailContent,
		showSave: false,
		showChangeStatus: true,
		showSaveChanges: false,
		showPasteTask: false,
	},
	{
		id: 3,
		ModelName: customCaptions.asset,
		name: `${customCaptions.asset} (${detail?.assetCount || 0})`,
		path: modelAssest,
		component: ModelAsset,
		showSave: false,
		showChangeStatus: false,
		showSaveChanges: false,
		showPasteTask: false,
		showAdd: true,
	},
	{
		id: 2,
		ModelName: customCaptions.zonePlural,
		name: `${customCaptions.zonePlural} (${detail?.zoneCount || 0})`,
		path: modelZones,
		component: Zones,
		showSave: false,
		showChangeStatus: false,
		showSaveChanges: false,
		showPasteTask: false,
		showAdd: true,
	},
	{
		id: 4,
		ModelName: customCaptions.stagePlural,
		name: `${customCaptions.stagePlural} (${detail?.stageCount || 0})`,
		path: modelStages,
		component: ModelStage,
		showAdd: true,
		showSave: false,
		showChangeStatus: false,
		showSaveChanges: false,
		showPasteTask: false,
	},
	{
		id: 5,
		ModelName: customCaptions.intervalPlural,
		name: `${customCaptions.intervalPlural} (${detail?.intervalCount || 0})`,
		path: modelIntervals,
		component: ModelInterval,
		showAdd: true,
		showSave: false,
		showChangeStatus: false,
		showSaveChanges: false,
		showPasteTask: false,
	},
	{
		id: 6,
		ModelName: customCaptions.rolePlural,
		name: `${customCaptions.rolePlural} (${detail?.roleCount || 0})`,
		path: modelRoles,
		component: Roles,
		showSave: false,
		showChangeStatus: false,
		showSaveChanges: false,
		showPasteTask: false,
		showAdd: true,
	},

	{
		id: 7,

		ModelName: customCaptions.questionPlural,
		name: `${customCaptions.questionPlural} (${detail?.questionCount || 0})`,
		path: modelQuestions,
		component: ModelQuestion,
		showAdd: true,
		showSave: false,
		showChangeStatus: false,
		showSaveChanges: false,
		showPasteTask: true,
	},

	{
		id: 8,
		ModelName: customCaptions.taskPlural,
		name: `${customCaptions.taskPlural} (${detail?.taskCount || 0})`,
		path: modelTask,
		component: Task,
		showSave: false,
		showChangeStatus: false,
		showSaveChanges: false,
		showPasteTask: true,
		showAdd: true,
		isPasteTaskDisabled: true,
	},
	{
		id: 9,
		ModelName: "Service Layout",
		name: "Service Layout",
		path: modelServiceLayout,
		component: ModelServiceLayout,
		showSave: false,
		showChangeStatus: false,
		showSaveChanges: false,
		showPasteTask: false,
		showAdd: false,
		isPasteTaskDisabled: false,
	},
];

export default routeList;
