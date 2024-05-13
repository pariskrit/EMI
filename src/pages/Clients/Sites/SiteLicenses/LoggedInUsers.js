import React from "react";
import AccordionBox from "components/Layouts/AccordionBox";
import SimpleDataTable from "components/Modules/SimpleDataTable";

const LoggedInUsers = ({ usersList, isLoading }) => {
	return (
		<AccordionBox
			title="Logged In Users"
			accordianDetailsCss="siteDetailTableContainer"
		>
			<SimpleDataTable
				isLoading={isLoading}
				data={usersList}
				tableHeaders={["First Name", "Last Name", "Login Date"]}
			/>
		</AccordionBox>
	);
};

export default LoggedInUsers;
