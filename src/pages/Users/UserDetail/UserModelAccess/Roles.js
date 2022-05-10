import AccordionBox from "components/Layouts/AccordionBox";
import CheckboxContainer from "components/Modules/CheckboxContainer";
import React from "react";

function Roles({ data, captions, handleCheck }) {
	return (
		<AccordionBox title={captions[0] ?? "Roles"}>
			<div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
				<em>
					Bill Thompson can perform {captions[1] ?? "Services"} for the
					following {captions[0] ?? "Roles"}
				</em>
				<CheckboxContainer checkBoxes={data} onCheck={handleCheck} />
			</div>
		</AccordionBox>
	);
}

export default Roles;
