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
