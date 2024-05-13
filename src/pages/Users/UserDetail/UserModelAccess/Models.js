import AccordionBox from "components/Layouts/AccordionBox";
import CheckboxContainer from "components/Modules/CheckboxContainer";
import React from "react";
import GeneralButton from "components/Elements/GeneralButton";
import { LinearProgress } from "@mui/material";
import { makeStyles } from "tss-react/mui";
import { createTheme, ThemeProvider } from "@mui/styles";

const useStyles = makeStyles()((theme) => ({
	main: {
		display: "flex",
		flexDirection: "column",
		gap: "15px",
		flex: "1",
	},
	buttonDiv: {
		display: "flex",
		gap: "5rem",
		justifyContent: "space-between",
	},
	button: {
		backgroundColor: "#23bb79",
		height: "2rem",
		width: "6rem",
		marginTop: "-6px",
	},
}));

function Models({
	data,
	captions,
	tickAllModel,
	handleCheck,
	name,
	tickAllLoading,
}) {
	const { classes, cx } = useStyles();
	return (
		<AccordionBox title={captions[0] ?? "Models"}>
			<div className={classes.main}>
				{tickAllLoading && <LinearProgress />}
				<div className={classes.buttonDiv}>
					<em>
						{name} can perform {captions[1] ?? "Services"} for the following{" "}
						{captions[0] ?? "Models"}
					</em>
					<GeneralButton
						className={classes.button}
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
