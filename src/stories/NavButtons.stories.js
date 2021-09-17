import React from "react";
import NavButtons from "components/Elements/NavButtons";

export default {
	title: "Components/NavButtons",
	component: NavButtons,
};

const Template = (args) => <NavButtons {...args} />;

export const Normal = Template.bind({});

Normal.args = {
	navigation: [
		{ name: "Details" },
		{ name: "Assets" },
		{ name: "Departments" },
		{ name: "Locations" },
	],
	current: "Details",
};

export const Dropdown = Template.bind({});

Dropdown.args = {
	navigation: [
		{ name: "Details", dropdown: [{ title: "one" }, { title: "two" }] },
		{ name: "Assets", dropdown: [{ title: "three" }, { title: "four" }] },
		{ name: "Departments", dropdown: [{ title: "five" }, { title: "six" }] },
		{ name: "Locations" },
	],
	current: "Details",
};
