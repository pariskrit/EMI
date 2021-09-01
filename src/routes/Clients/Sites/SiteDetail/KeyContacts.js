import React from "react";
import AccordionBox from "components/AccordionBox";
import SimpleDataTable from "components/SimpleDataTable";

const KeyContacts = ({ contactsList }) => {
	return (
		<AccordionBox title="Key Contacts">
			<SimpleDataTable
				data={contactsList}
				tableHeaders={["Name", "Product", "Email", "Phone"]}
			/>
		</AccordionBox>
	);
};

export default KeyContacts;
