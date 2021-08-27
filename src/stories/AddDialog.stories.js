import AddDialog from "components/AddDialog";
import React from "react";

export default {
	title: "Components/AddDialog",
	component: AddDialog,
};

const Template = (args) => <AddDialog {...args} />;

export const Asset = Template.bind({});

Asset.args = {
	open: true,
	title: "Asset",
	inputFieldLists: [
		{
			label: "Name",
			value: "abcd",
			error: { isError: false, message: null },
		},
		{
			label: "Description",
			value: "asd asd asd as asd",
			error: { isError: false, message: null },
		},
	],
};

export const Location = Template.bind({});

Location.args = {
	open: true,
	title: "Location",
	inputFieldLists: [
		{
			label: "Name",
			value: "Australia",
			error: { isError: false, message: null },
		},
	],
};

export const Department = Template.bind({});

Department.args = {
	open: true,
	title: "Department",
	inputFieldLists: [
		{
			label: "Name",
			value: "Australia",
			error: { isError: false, message: null },
		},
		{
			label: "Description",
			value: " asdf asdf sadfas dfl",
			error: { isError: false, message: null },
		},
	],
};

export const Error = Template.bind({});

Error.args = {
	open: true,
	title: "Department",
	inputFieldLists: [
		{
			label: "Name",
			value: "",
			error: { isError: true, message: "Name is required" },
		},
		{
			label: "Description",
			value: " asdf asdf sadfas dfl",
			error: { isError: false, message: null },
		},
	],
};
