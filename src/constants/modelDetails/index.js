export const settingsInputList = [
	{ id: 1, name: "showTimer", label: "Show Timer" },
	{
		id: 2,
		name: "allowTickAllPartsTools",
		label: "Allow 'Tick All' for Parts/Tools in Service",
	},
	{
		id: 3,
		name: "listPartsToolsByStageZone",
		label: "List Parts By Stage",
	},
	{
		id: 4,
		name: "hideTools",
		label: "Hide Tools In Service",
	},
	{
		id: 5,
		name: "hideParts",
		label: "Hide Parts In Service",
	},
];

export const Questionheaders = (rolePlural) => [
	{ id: 1, name: "Caption", width: "20vw" },
	{ id: 2, name: "Type", width: "10vw" },
	{ id: 3, name: "Timing", width: "15vw" },
	{ id: 4, name: rolePlural, width: "17vw" },
	{ id: 5, name: "Compulsory", width: "8vw" },
	{ id: 6, name: "Additional Options", width: "30vw" },
];

export const QuestionColumn = [
	{ id: 1, name: "caption", style: { width: "20vw" } },
	{ id: 2, name: "modelType", style: { width: "10vw" } },
	{ id: 3, name: "modelTiming", style: { width: "15vw" } },
	{ id: 4, name: "modelRoles", style: { width: "17vw" } },
	{ id: 5, name: "compulsory", style: { width: "8vw" } },
	{ id: 6, name: "additional", style: { width: "30vw" } },
];

export const ModelZoneTableHeader = (ModelType, customCaptions) => {
	if (ModelType === "F")
		return ["Name", "Image", `Default ${customCaptions.asset} Filter`];
	else return ["Name", "Image"];
};

export const ModelZoneTableColumn = (ModelType) => {
	if (ModelType === "F")
		return [
			{ id: 1, name: "name", style: { width: "33vw" } },
			{ id: 2, name: "imageURL", style: { width: "33vw" } },
			{ id: 3, name: "defaultSiteAssetFilter", style: { width: "33vw" } },
		];
	else
		return [
			{ id: 1, name: "name", style: { width: "50vw" } },
			{ id: 2, name: "imageURL", style: { width: "50vw" } },
		];
};

export const ModelStageTableHeader = (ModelType, asset, zonePlural) => {
	if (ModelType === "F")
		return ["Name", "Image", `Has ${zonePlural}`, `Default ${asset} Filter`];
	else return ["Name", "Image", `Has ${zonePlural}`];
};

export const ModelStageTableColumn = (ModelType) => {
	if (ModelType === "F")
		return [
			{ id: 1, name: "name", style: { width: "35vw" } },
			{ id: 2, name: "image", style: { width: "35vw" } },
			{ id: 3, name: "hasZones", style: { width: "10vw" } },
			{ id: 4, name: "defaultSiteAssetFilter", style: { width: "20vw" } },
		];
	else
		return [
			{ id: 1, name: "name", style: { width: "40vw" } },
			{ id: 2, name: "image", style: { width: "40vw" } },
			{ id: 3, name: "hasZones", style: { width: "20vw" } },
		];
};

export const ZONES = "zones";
export const QUESTION = "question";
export const QUESTIONPLURAL = "questions";
export const TASK = "task";
export const TASKPLURAL = "tasks";

export const COLLAPSEDID = "collapsedId";
