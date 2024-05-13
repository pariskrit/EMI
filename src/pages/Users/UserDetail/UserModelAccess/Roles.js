import AccordionBox from "components/Layouts/AccordionBox";
import CheckboxContainer from "components/Modules/CheckboxContainer";
import React from "react";
import { LinearProgress } from "@mui/material";

function Roles({ data, captions, handleCheck, name, roleChangeLoading }) {
	return (
		<AccordionBox title={captions[0] ?? "Roles"}>
			<div style={{ width: "100%" }}>
				{roleChangeLoading && (
					<div className="mb-sm">
						<LinearProgress />
					</div>
				)}

				<div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
					<em>
						{name} can perform {captions[1] ?? "Services"} for the following{" "}
						{captions[0] ?? "Roles"}
					</em>
					<CheckboxContainer checkBoxes={data} onCheck={handleCheck} />
				</div>
			</div>
		</AccordionBox>
	);
}

export default Roles;
