import React from "react";
import { makeStyles } from "tss-react/mui";
import { createTheme, ThemeProvider } from "@mui/styles";

import Checkbox from "@mui/material/Checkbox";

// Import icons
import CheckboxOff from "assets/icons/checkbox-off.svg";
import CheckboxOn from "assets/icons/checkbox-on-with-tick.svg";

const useStyles = makeStyles()((theme) => ({
	emiCheckbox: {
		transform: "scale(0.9)",
		padding: "9px 9px 9px 0",
	},
}));

const EMICheckbox = ({ state, changeHandler, name, disabled, ...rest }) => {
	// Init hooks
	const { classes, cx } = useStyles();
	const enterKeyPress = (e) => {
		if (e.key === "Enter") {
			document.activeElement.click();
		}
	};

	return (
		<Checkbox
			className={classes.emiCheckbox}
			checked={state}
			name={name}
			onChange={changeHandler}
			icon={<img src={CheckboxOff} alt="unticked checkbox" />}
			checkedIcon={<img src={CheckboxOn} alt="ticked checkbox" />}
			disabled={disabled}
			{...rest}
			onKeyDown={enterKeyPress}
		/>
	);
};

export default EMICheckbox;
