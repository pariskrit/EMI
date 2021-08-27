import React from "react";

import EditDialog from "components/EditDialog";

export default {
	title: "Components/EditDialog",
	component: EditDialog,
};

const Template = (args) => <EditDialog {...args} />;

export const Location = Template.bind({});

Location.args = {
	open: true,
	title: "Location",
	inputFieldLists: [{ label: "Name", value: "pari" }],
	errors: [{ isError: false, message: null }],
};

export const Department = Template.bind({});

Department.args = {
	open: true,
	title: "Department",
	inputFieldLists: [
		{ label: "Name", value: "pariskrit" },
		{ label: "Description", value: "hello" },
	],
	errors: [
		{ isError: false, message: null },
		{ isError: false, message: null },
	],
};

export const Error = Template.bind({});

Error.args = {
	...Department.args,
	errors: [
		{ isError: true, message: "Name is required" },
		{ isError: false, message: null },
	],
};

export const Updating = Template.bind({});

Updating.args = {
	...Department.args,
	isUpdating: true,
};
