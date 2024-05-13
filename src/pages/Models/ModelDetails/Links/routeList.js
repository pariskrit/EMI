import ModelDetailContent from "pages/Models/ModelDetails/ModelDetail/ModelDetailContent";
import {
	modelAssest,
	modelRoles,
	modelZones,
	modelStages,
	modelQuestions,
	modelTask,
	modelServiceLayout,
	modelIntervals,
	modelArrangement,
} from "helpers/routePaths";
import ModelAsset from "pages/Models/ModelDetails/ModelAsset";
import ModelStage from "pages/Models/ModelDetails/ModelStages";
import Roles from "pages/Models/ModelDetails/ModelRoles/Roles";
import Zones from "pages/Models/ModelDetails/ModelZones/Zones";
import ModelInterval from "pages/Models/ModelDetails/ModelIntervals";
import ModelQuestion from "pages/Models/ModelDetails/ModelQuestion";
import Task from "pages/Models/ModelDetails/ModelTasks/Task";
import ModelServiceLayout from "pages/Models/ModelDetails/ModelServiceLayout";
import Arrangements from "pages/Models/ModelDetails/ModelArrangements/Arrangements";

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
		showVersion: true,
		showSwitch: true,
	},
	{
		id: 3,
		ModelName: customCaptions?.assetPlural,
		name: `${customCaptions?.assetPlural} (${detail?.assetCount || 0})`,
		path: modelAssest,
		component: ModelAsset,
		showSave: false,
		showChangeStatus: false,
		showSaveChanges: false,
		showPasteTask: false,
		showAdd: true,
	},
	{
		id: 10,
		ModelName: customCaptions?.arrangementPlural,
		name: `${customCaptions?.arrangementPlural} (${
			detail?.arrangementCount || 0
		})`,
		path: modelArrangement,
		component: Arrangements,
		showSave: false,
		showChangeStatus: false,
		showSaveChanges: false,
		showPasteTask: false,
		showAdd: true,
	},
	{
		id: 2,
		ModelName: customCaptions?.zonePlural,
		name: `${customCaptions?.zonePlural} (${detail?.zoneCount || 0})`,
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
		ModelName: customCaptions?.stagePlural,
		name: `${customCaptions?.stagePlural} (${detail?.stageCount || 0})`,
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
		ModelName: customCaptions?.intervalPlural,
		name: `${customCaptions?.intervalPlural} (${detail?.intervalCount || 0})`,
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
		ModelName: customCaptions?.rolePlural,
		name: `${customCaptions?.rolePlural} (${detail?.roleCount || 0})`,
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

		ModelName: customCaptions?.questionPlural,
		name: `${customCaptions?.questionPlural} (${detail?.questionCount || 0})`,
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
		ModelName: customCaptions?.taskPlural,
		name: `${customCaptions?.taskPlural} (${detail?.taskCount || 0})`,
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
		name: `${customCaptions?.service} Layout`,
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
