import {
	modelAssest,
	modelDetailsPath,
	modelIntervals,
	modelQuestions,
	modelRoles,
	modelServiceLayout,
	modelStages,
	modelTask,
	modelZones,
} from "helpers/routePaths";
import ModelTasks from "../ModelTasks";

export const routeList = [
	{ id: 1, component: ModelTasks, path: modelDetailsPath },
	{ id: 2, component: ModelTasks, path: modelDetailsPath + modelStages },
	{ id: 3, component: ModelTasks, path: modelDetailsPath + modelZones },
	{ id: 4, component: ModelTasks, path: modelDetailsPath + modelIntervals },
	{ id: 5, component: ModelTasks, path: modelDetailsPath + modelRoles },
	{ id: 6, component: ModelTasks, path: modelDetailsPath + modelQuestions },
	{ id: 7, component: ModelTasks, path: modelDetailsPath + modelTask },
	{ id: 8, component: ModelTasks, path: modelDetailsPath + modelServiceLayout },
	{ id: 9, component: ModelTasks, path: modelDetailsPath + modelAssest },
];
