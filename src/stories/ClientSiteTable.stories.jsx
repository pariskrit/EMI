import React from "react";
import ClientSiteTable from "components/ClientSiteTable";

export default {
	title: "Components/ClientSiteTable",
	component: ClientSiteTable,
	parameters: { actions: { argTypesRegex: "^on.*" } },
};

const Template = (args) => <ClientSiteTable {...args} />;

export const Table = Template.bind({});

Table.args = {
	data: [
		{
			id: 1,
			asset: "Rujal",
			reference: "2060-100-22-80-BLG007-AIHV",
			description: "Building Change room M DBS BD007",
			plannerGroup: "215",
			center: "2DEL",
		},
		{
			id: 2,
			asset: "Ram Prasad",
			reference: "2060-10-22",
			description: "This is final Testing of the table",
			plannerGroup: "215",
			center: "2DEL",
		},
	],
	columns: ["asset", "reference", "description", "plannerGroup", "center"],
	headers: [
		"Asset",
		"Reference",
		"Description",
		"Planner Groups",
		"Main work Center",
	],
};
