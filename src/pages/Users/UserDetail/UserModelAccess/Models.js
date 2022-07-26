import AccordionBox from "components/Layouts/AccordionBox";
import CheckboxContainer from "components/Modules/CheckboxContainer";
import React from "react";
import GeneralButton from "components/Elements/GeneralButton";
import { LinearProgress } from "@material-ui/core";

function Models({
	data,
	captions,
	tickAllModel,
	handleCheck,
	name,
	tickAllLoading,
}) {
	return (
		<AccordionBox title={captions[0] ?? "Models"} style={{ marginTop: "15px" }}>
			<div
				style={{
					display: "flex",
					flexDirection: "column",
					gap: "15px",
					flex: "1",
				}}
			>
				{tickAllLoading && <LinearProgress />}
				<div
					style={{
						display: "flex",
						gap: "5rem",
						justifyContent: "space-between",
					}}
				>
					<em>
						{name} can perform {captions[1] ?? "Services"} for the following{" "}
						{captions[0] ?? "Models"}
					</em>
					<GeneralButton
						style={{
							backgroundColor: "#23bb79",
							height: "2rem",
							width: "6rem",
							marginTop: "-6px",
						}}
						onClick={() => {
							tickAllModel();
						}}
					>
						Tick All
					</GeneralButton>
				</div>

				<CheckboxContainer checkBoxes={data} onCheck={handleCheck} />
			</div>
		</AccordionBox>
	);
}

export default Models;
