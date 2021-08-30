import React, { useState, useEffect } from "react";
import AccordionBox from "components/AccordionBox";
import SimpleDataTable from "components/SimpleDataTable";
import { BASE_API_PATH } from "helpers/constants";
import API from "helpers/api";

const KeyContacts = ({ siteId }) => {
	const [applicationList, setApplicationList] = useState([]);

	const fetchKeyContactsList = async () => {
		try {
			const result = await API.get(
				`${BASE_API_PATH}siteappkeycontacts/Site/${siteId}`
			);

			console.log(result);
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
				data={[
					{
						name: "pariskrit",
						product: "abc",
						email: "ggg@gmail.com",
						phone: 123123,
					},
				]}
				tableHeaders={["Name", "Product", "Email", "Phone"]}
			/>
		</AccordionBox>
	);
};

export default KeyContacts;
