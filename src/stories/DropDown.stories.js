import React from "react";
import DropDown from "components/Elements/DyamicDropdown";

export default {
	title: "Components/DropDown",
	component: DropDown,
};

const Template = (args) => <DropDown {...args} />;

export const Normal = Template.bind({});

Normal.args = {
	columns: [
		{ name: "Department", id: 1 },
		{ name: "Description", id: 2, minWidth: "200px" },
	],
	dataHeader: [
		{ name: "Department", id: 1 },
		{ name: "Description", id: 2, minWidth: "200px" },
	],
	selectdValueToshow: "",
};
