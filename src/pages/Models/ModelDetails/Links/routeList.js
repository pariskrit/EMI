import ModelStage from "../ModelStage";
import { modelAssest, modelZones, modelStages } from "helpers/routePaths";
import Test from "pages/Test";
import Zones from "../ModelZones/Zones";

const routeList = [
	{
		id: 3,
		name: "Asset",
		path: modelAssest,
		component: Test,
		showSave: false,
		showChangeStatus: false,
		showSaveChanges: false,
		showPasteTask: false,
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
];

export default routeList;
