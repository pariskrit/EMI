import React from "react";
import CommonHeader from "components/CommonHeader";

export default {
	title: "components/CommonHeader",
	component: CommonHeader,
};

const Template = (args) => <CommonHeader {...args} />;

export const CommonHeaderComponent = Template.bind({});

CommonHeaderComponent.args = {
	status: false,
	showSwitch: true,
	isUpdating: false,
	currentStatus: true,
	showDuplicate: true,
	showAdd: false,
	showSave: true,
	showHistory: false,
	data: {
		name: "ZZZ",
	},
	navigation: [],
};
