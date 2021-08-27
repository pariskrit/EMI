import React from "react";

import SimpleDataTable from "components/SimpleDataTable";

export default {
	title: "Components/SimpleDataTable",
	component: SimpleDataTable,
};

const Template = (args) => <SimpleDataTable {...args} />;

export const SingleRow = Template.bind({});

SingleRow.args = {
	data: [
		{
			name: "pariskrit",
			product: "abc",
			application: "run",
			email: "@gmail.com",
			phone: 123123,
		},
	],
	tableHeaders: ["Name", "Product", "application", "Email", "Phone"],
};

export const MultipleRow = Template.bind({});

MultipleRow.args = {
	data: [
		{
			name: "pariskrit",
			product: "abc",
			email: "@gmail.com",
			phone: 123123,
		},
		{
			name: "hello",
			product: "abc",
			email: "asdsda@gmail.com",
			phone: 123121231233,
		},
		{
			name: "pariskrissdadt",
			product: "abc",
			email: "wwww@gmail.com",
			phone: 123123123123,
		},
	],
	tableHeaders: ["Name", "Product", "Email", "Phone"],
};
