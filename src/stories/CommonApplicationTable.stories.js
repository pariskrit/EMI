import React from "react";
import CommonApplicationTable from "components/Modules/CommonApplicationTable";

export default {
	title: "components/CommonApplicationTable",
	component: "CommonApplicationTable",
};

const Template = (args) => <CommonApplicationTable {...args} />;

export const CommonApplicationTableComponent = Template.bind({});

CommonApplicationTableComponent.args = {
	data: [
		{
			name: "XYZ",
		},
		{
			name: "ABC",
		},
	],
	columns: ["name"],
	headers: ["Name"],
};
