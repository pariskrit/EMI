import React, { useState, useEffect } from "react";
import AccordionBox from "components/AccordionBox";
import SimpleDataTable from "components/SimpleDataTable";
import { BASE_API_PATH } from "helpers/constants";
import API from "helpers/api";

const KeyContacts = ({ siteId }) => {
	const [contactsList, setContactsList] = useState([]);

	const fetchKeyContactsList = async () => {
		try {
			const result = await API.get(
				`${BASE_API_PATH}siteappkeycontacts/Site/${siteId}`
			);

			setContactsList(
				result.data.map((data) => ({
					id: data.userID,
					name: data.displayName,
					product: data.name,
					email: data.email,
					phone: data.phone,
				}))
			);
		} catch (error) {
			console.log(error);
		}
	};

	useEffect(() => {
		fetchKeyContactsList();
	}, []);

	return (
		<AccordionBox title="Key Contacts">
			<SimpleDataTable
				data={contactsList}
				tableHeaders={["Name", "Product", "Email", "Phone"]}
			/>
			{/* {contactsList.length === 0 && (
				<p style={{ margin: "12px 8px", fontWeight: "500" }}>
					No Records Found
				</p>
			)} */}
		</AccordionBox>
	);
};

export default KeyContacts;
