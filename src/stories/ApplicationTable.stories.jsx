import React from "react";
import ApplicationTable from "components/ApplicationTable";

export default {
	title: "Table/ApplicationTable",
	component: ApplicationTable,
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
	],
};
