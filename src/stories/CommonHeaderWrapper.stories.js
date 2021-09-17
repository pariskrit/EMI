import React from "react";
import CommonHeaderWrapper from "components/Modules/CommonHeaderWrapper";

export default {
	title: "components/CommonHeaderWrapper",
	component: CommonHeaderWrapper,
};

const Template = (args) => <CommonHeaderWrapper {...args} />;

export const CommonHeaderWrapperComponent = Template.bind({});

CommonHeaderWrapperComponent.args = {
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
	current: "Reason Definitions",
	navigation: [
		{
			name: "Details",
			dropdown: [
				{ title: "Application", link: `` },
				{
					title: "Custom Captions",
					link: "",
				},
			],
		},
		{
			name: "Reason Definitions",
			dropdown: [
				{ title: "Pauses", link: `` },
				{ title: "Stops", link: `` },
				{
					title: "Skipped Tasks",
					link: ``,
				},
				{
					title: "Missing Part or Tools",
					link: ``,
				},
				{
					title: "Status Changes",
					link: ``,
				},
			],
		},
		{
			name: "Model Definitions",
			dropdown: [
				{
					title: "Statuses",
					link: ``,
				},
				{ title: "Types", link: `` },
			],
		},
		{
			name: "Task Definitions",
			dropdown: [
				{ title: "Actions", link: `` },
				{ title: "Systems", link: `` },
				{
					title: "Operating Modes",
					link: ``,
				},
			],
		},
		{
			name: "User Definitions",
			dropdown: [
				{
					title: "Positions",
					link: ``,
				},
				{ title: "Roles", link: `` },
			],
		},
		{
			name: "Defect Definitions",
			dropdown: [
				{
					title: "Risk Ratings",
					link: ``,
				},
				{
					title: "Statuses",
					link: ``,
				},
				{ title: "Types", link: `` },
			],
		},
		{
			name: "Feedback Definitions",
			dropdown: [
				{
					title: "Classifications",
					link: ``,
				},
				{
					title: "Priorities",
					link: ``,
				},
				{
					title: "Statuses",
					link: ``,
				},
			],
		},
	],
};
