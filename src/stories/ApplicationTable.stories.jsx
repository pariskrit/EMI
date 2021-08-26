import React from "react";
import ApplicationTable from "components/ApplicationTable";

export default {
	title: "Table/ApplicationTable",
	component: ApplicationTable,
	// argTypes: {
	// 	onDeleteApp: { action: "clicked" },
	// 	onChangeApp: { action: "clicked" },
	// },
	parameters: { actions: { argTypesRegex: "^on.*" } },
};

const Template = (args) => <ApplicationTable {...args} />;

export const Table = Template.bind({});

Table.args = {
	data: [
		{
			applicationID: 1,
			id: 34,
			isActive: false,
			name: "ComponentStatus",
			totalSites: 0,
		},
		{
			applicationID: 2,
			id: 33,
			isActive: true,
			name: "Safety Status",
			totalSites: 0,
		},
	],
};
