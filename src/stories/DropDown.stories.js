import React from "react";
import DropDown from "components/Elements/DyamicDropdown";
import { handleSort } from "helpers/utils";

export default {
	title: "Components/DropDown",
	component: DropDown,
	// parameters: { actions: { argTypesRegex: "^on.*" } },
};

const Template = (args) => <DropDown {...args} />;

export const Normal = Template.bind({});

Normal.args = {
	columns: [{ name: "Department", id: 1 }],
	dataSource: [
		{
			Department: "Loreum Ipsum",
			id: 1,
		},
		{
			Department: " A Loreum Ipsum",
			id: 2,
		},
		{
			Department: "Loreum Ipsum",
			id: 3,
		},
	],
};

export const MultiColumn = Template.bind({});

MultiColumn.args = {
	columns: [
		{ name: "Department", id: 1 },
		{ name: "Description", id: 2, minWidth: "200px" },
	],
	dataHeader: [
		{ name: "Department", id: 1 },
		{ name: "Description", id: 2, minWidth: "200px" },
	],
	dataSource: [
		{
			Department: "Loreum Ipsum",
			Description: "Loreum Ipsum Cassandara",
			id: 1,
		},
		{
			Department: " A Loreum Ipsum",
			Description: "Loreum Ipsum Cassandara",
			id: 2,
		},
		{
			Department: "Loreum Ipsum",
			Description: "Loreum Ipsum Cassandara",
			id: 3,
		},
		{
			Department: "Loreum Ipsum",
			Description: "Loreum Ipsum Cassandara",
			id: 4,
		},
		{
			Department: "Loreum Ipsum",
			Description: "Loreum Ipsum Cassandara",
			id: 5,
		},
		{
			Department: "Loreum Ipsum",
			Description: "Loreum Ipsum Cassandara",
			id: 6,
		},
		{
			Department: "Loreum Ipsum",
			Description: "Loreum Ipsum Cassandara",
			id: 7,
		},
	],
	selectedValue: {
		Department: "A Loreum Ipsum",
		Description: "Loreum Ipsum Cassandara",
		id: 2,
	},
	label: "Select Item",
	showHeader: true,
	isSelected: false,
	isServerSide: false,
	handleSort: handleSort,

	selectdValueToshow: "Department",
};
