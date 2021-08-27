import React from "react";
import AccordionBox from "components/AccordionBox";
import ApplicationTable from "components/ApplicationTable";

const Applications = () => {
	return (
		<AccordionBox title="Applications">
			<ApplicationTable
				onDeleteApp={(id) => console.log(id)}
				onChangeApp={(id) => console.log(id)}
			/>
		</AccordionBox>
	);
};

export default Applications;
