import { Typography } from "@material-ui/core";
import Dropdown from "components/Elements/Dropdown";
import { makeStyles } from "@material-ui/styles";

import React from "react";

const useStyles = makeStyles((theme) => ({
	labelText: {
		fontFamily: "Roboto Condensed",
		fontWeight: "bold",
		fontSize: "14px",
		marginBottom: "5px",
	},
	inputText: {
		color: "#000000de",
	},
}));
function DropdownContainer({
	label,
	name,
	options,
	onChange,
	selectedInputData,
	className = null,
}) {
	const classes = useStyles();

	return (
		<div className={className} style={{ marginBottom: "14px" }}>
			<Typography className={classes.labelText}>
				{label}
				<span style={{ color: "#E31212" }}>*</span>
			</Typography>
			<Dropdown
				options={options}
				selectedValue={selectedInputData}
				onChange={(value) => onChange(name, value)}
				width="100%"
			/>
		</div>
	);
}

export default DropdownContainer;
