import ModelDetailContent from "../ModelDetail/ModelDetailContent";
import ModelAsset from "../ModelAsset";
import {
	modelAssest,
	modelRoles,
	modelZones,
	modelStages,
	modelTask,
} from "helpers/routePaths";
import ModelStage from "../ModelStage";
import Roles from "../ModelRoles/Roles";
import Zones from "../ModelZones/Zones";
import Task from "../ModelTasks/Task";

const routeList = [
	{
		id: 1,
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
		name: "Asset",
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
		name: "Zones",
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
		name: "Stages",
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
		name: "Roles",
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
		name: "Tasks",
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
