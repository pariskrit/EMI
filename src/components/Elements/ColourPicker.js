import React from "react";
import { HexColorPicker, HexColorInput } from "react-colorful";
import { makeStyles } from "tss-react/mui";
import { createTheme, ThemeProvider } from "@mui/styles";

const useStyles = makeStyles()((theme) => ({
	colourInput: {
		marginTop: "10%",
		marginBottom: "10%",
		textAlign: "center",
		width: "40%",
	},
}));

const ColourPicker = ({ colour, updateParent, includeInput }) => {
	// Init hooks
	const { classes, cx } = useStyles();

	// Handling no includeInput prop - defaults to false
	if (includeInput === undefined) {
		includeInput = false;
	}

	// Conditionally rendering hex input
	if (includeInput) {
		return (
			<div>
				<HexColorPicker color={colour} onChange={updateParent} />

				<HexColorInput
					className={classes.colourInput}
					color={colour}
					onChange={updateParent}
				/>
			</div>
		);
	} else {
		return (
			<div>
				<HexColorPicker color={colour} onChange={updateParent} />
			</div>
		);
	}
};

export default ColourPicker;
