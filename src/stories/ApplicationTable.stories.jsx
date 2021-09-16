import React from "react";
import ApplicationTable from "components/Modules/ApplicationTable";

export default {
	title: "Components/ApplicationTable",
	component: ApplicationTable,
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
