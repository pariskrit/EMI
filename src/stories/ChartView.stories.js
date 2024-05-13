import React from "react";
import ChartView from "pages/Services/AlternateView/ChartView";

export default {
	title: "components/ChartView",
	component: ChartView,
};

const Template = (args) => <ChartView {...args} />;

const columns = [
	{ type: "string", label: "Task ID" },
	{ type: "string", label: "Task Name" },
	{ type: "string", label: "Resource" },
	{ type: "date", label: "Start Date" },
	{ type: "date", label: "End Date" },
	{ type: "number", label: "Duration" },
	{ type: "number", label: "Percent Complete" },
	{ type: "string", label: "Dependencies" },
];

const rows = [
	[
		"2014Spring",
		"Spring 2014",
		"spring",
		new Date(2014, 2, 22),
		new Date(2014, 5, 20),
		null,
		100,
		null,
	],
	[
		"Baseball",
		"Baseball Season",
		"sports",
		new Date(2015, 2, 31),
		new Date(2015, 9, 20),
		null,
		14,
		null,
	],
	[
		"Basketball",
		"Basketball Season",
		"sports",
		new Date(2014, 9, 28),
		new Date(2015, 5, 20),
		null,
		86,
		null,
	],
	[
		"2014Summer",
		"Summer 2014",
		"summer",
		new Date(2014, 5, 21),
		new Date(2014, 8, 20),
		null,
		100,
		null,
	],
];

const data = [columns, ...rows];

export const Charts = Template.bind({});
Charts.args = {
	data: data,
	options: {
		height: "500px",
	},
};
