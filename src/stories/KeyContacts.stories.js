import React from "react";

import KeyContacts from "components/SimpleDataTable";

export default {
	title: "Components/Key Contacts",
	component: KeyContacts,
	argTypes: {
		data: [
			{ name: "pariskrit", product: "abc", email: "@gmail.com", phone: 123123 },
		],
	},
};

export const SingleRow = () => (
	<KeyContacts
		data={[
			{
				name: "pariskrit",
				product: "abc",
				application: "run",
				email: "@gmail.com",
				phone: 123123,
			},
		]}
		tableHeaders={["Name", "Product", "application", "Email", "Phone"]}
	/>
);

export const MultipleRow = () => (
	<KeyContacts
		data={[
			{
				name: "pariskrit",
				product: "abc",
				email: "asdasd@gmail.com",
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
		]}
		tableHeaders={["Name", "Product", "Email", "Phone"]}
	/>
);
