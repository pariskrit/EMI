import React from "react";
import CommonHeader from "components/Modules/CommonHeader";

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
	showImport: false,
	data: {
		name: "ZZZ",
	},
	navigation: [],
};
