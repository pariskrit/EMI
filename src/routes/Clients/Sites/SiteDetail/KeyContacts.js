import React from "react";
import AccordionBox from "components/AccordionBox";
import SimpleDataTable from "components/SimpleDataTable";

const KeyContacts = () => {
	return (
		<AccordionBox title="Key Contacts">
			<SimpleDataTable
				data={[
					{
						name: "pariskrit",
						product: "abc",
						application: "run",
						email: "ggg@gmail.com",
						phone: 123123,
					},
				]}
				tableHeaders={["Name", "Product", "Application", "Email", "Phone"]}
			/>
		</AccordionBox>
	);
};

export default KeyContacts;
