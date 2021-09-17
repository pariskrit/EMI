import React from "react";
import CommonApplicationTable from "components/CommonApplicationTable";

export default {
	title: "components/CommonApplicationTable",
	component: "CommonApplicationTable",
};

const Template = (args) => <CommonApplicationTable {...args} />;

export const CommonApplicationTableComponent = Template.bind({});

CommonApplicationTableComponent.args = {
	data: [
		{
			id: 1,
			name: "XXYZ",
		},
		{
			id: 2,
			name: "ABC",
		},
	],
	columns: ["name"],
	headers: ["Name"],
};
