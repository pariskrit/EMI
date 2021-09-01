import React from "react";
import LocationsTable from "components/LocationsTable";

export default {
	title: "Components/SiteLocationsTable",
	component: LocationsTable,
};

const Template = (args) => <LocationsTable />;

export const SiteLocationsTable = Template.bind({});

SiteLocationsTable.args = {
	datas: [
		{ name: "ABC", desc: "Company ABC" },
		{ name: "DEF", desc: "Company DEF" },
		{ name: "XYZ", desc: "Company XYZ" },
	],
};
