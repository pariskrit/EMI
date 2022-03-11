import ModelDetailContent from "../ModelDetail/ModelDetailContent";
import {
	modelAssest,
	modelRoles,
	modelZones,
	modelStages,
	modelQuestions,
	modelTask,
} from "helpers/routePaths";
import ModelAsset from "../ModelAsset";
import ModelStage from "../ModelStages";
import Roles from "../ModelRoles/Roles";
import Zones from "../ModelZones/Zones";
import ModelQuestion from "../ModelQuestion";
import Task from "../ModelTasks/Task";

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
		name: `${customCaptions.asset} (${detail.assetCount})`,
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
		name: `${customCaptions.zonePlural} (${detail.zoneCount})`,
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
		name: `${customCaptions.stagePlural} (${detail.stageCount})`,
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
		ModelName: customCaptions.questionPlural,
		name: `${customCaptions.questionPlural} (${detail.questionCount})`,
		path: modelQuestions,
		component: ModelQuestion,
		showAdd: true,
		showSave: false,
		showChangeStatus: false,
		showSaveChanges: false,
		showPasteTask: true,
	},
	{
		id: 6,
		ModelName: customCaptions.rolePlural,
		name: `${customCaptions.rolePlural} (${detail.roleCount})`,
		path: modelRoles,
		component: Roles,
		showSave: false,
		showChangeStatus: false,
		showSaveChanges: false,
		showPasteTask: false,
		showAdd: true,
	},
	{
		id: 8,
		ModelName: customCaptions.taskPlural,
		name: `${customCaptions.taskPlural} (${detail.taskCount})`,
		path: modelTask,
		component: Task,
		showSave: false,
		showChangeStatus: false,
		showSaveChanges: false,
		showPasteTask: true,
		showAdd: true,
		isPasteTaskDisabled: true,
	},
];

export default routeList;
