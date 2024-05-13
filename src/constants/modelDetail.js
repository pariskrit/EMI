const { customCaptions } =
	JSON.parse(sessionStorage.getItem("me")) ||
	JSON.parse(localStorage.getItem("me")) ||
	{};

export const questionTypeOptions = [
	{ label: "Checkbox", value: "B" },
	{ label: "Checkbox List", value: "C" },
	{ label: "Date", value: "D" },
	{ label: "Dropdown", value: "O" },
	{ label: "Long Text", value: "L" },
	{ label: "Number", value: "N" },
	{ label: "Short Text", value: "S" },
	{ label: "Time", value: "T" },
];

export const questionTimingOptions = [
	{ label: `Beginning of ${customCaptions?.service ?? "Service"}`, value: "B" },
	{
		label: `Completion of ${customCaptions?.service ?? "Service"}`,
		value: "E",
	},
	{ label: `Beginning of a ${customCaptions?.stage ?? "Stage"}`, value: "S" },
	{ label: `Beginning of a ${customCaptions?.zone ?? "Zone"}`, value: "Z" },
];
