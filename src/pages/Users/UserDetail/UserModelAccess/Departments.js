import AccordionBox from "components/Layouts/AccordionBox";
import CheckboxContainer from "components/Modules/CheckboxContainer";
import React from "react";

function Departments({ data, captions, handleCheck, name }) {
	return (
		<AccordionBox title={captions[0] ?? "Departments"}>
			<div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
				<em>
					{name} has access to {captions[1] ?? "Services"} of the following{" "}
					{captions[0] ?? "Departments"}
				</em>
				<CheckboxContainer checkBoxes={data} onCheck={handleCheck} />
			</div>
		</AccordionBox>
	);
}

export default Departments;
