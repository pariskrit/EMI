import React from "react";
import AccordionBox from "components/Layouts/AccordionBox";
import SimpleDataTable from "components/Modules/SimpleDataTable";

const KeyContacts = ({ contactsList, isLoading }) => {
	return (
		<AccordionBox
			title="Key Contacts"
			accordianDetailsCss="siteDetailTableContainer"
		>
			<SimpleDataTable
				isLoading={isLoading}
				data={contactsList}
				tableHeaders={["Name", "Product", "Email", "Phone"]}
			/>
		</AccordionBox>
	);
};

export default KeyContacts;
