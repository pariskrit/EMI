import React from "react";
import DepartmentsTable from "components/DepartmentsTable";

export default {
	title: "Components/SiteDepartmentsTable",
	component: DepartmentsTable,
};

const Template = (args) => <DepartmentsTable />;

export const SiteDepartmentsTable = Template.bind({});

SiteDepartmentsTable.args = {
	datas: [
		{ name: "ABC", desc: "Company ABC" },
		{ name: "DEF", desc: "Company DEF" },
		{ name: "XYZ", desc: "Company XYZ" },
	],
};
