import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Checkbox from "@material-ui/core/Checkbox";

// Import icons
import CheckboxOff from "assets/icons/checkbox-off.svg";
import CheckboxOn from "assets/icons/checkbox-on-with-tick.svg";

const useStyles = makeStyles((theme) => ({
	emiCheckbox: {
		transform: "scale(0.9)",
		padding: "9px 9px 9px 0",
	},
}));

const EMICheckbox = ({ state, changeHandler, name, disabled }) => {
	// Init hooks
	const classes = useStyles();

	return (
		<Checkbox
			className={classes.emiCheckbox}
			checked={state}
			name={name}
			onChange={changeHandler}
			icon={<img src={CheckboxOff} alt="unticked checkbox" />}
			checkedIcon={<img src={CheckboxOn} alt="ticked checkbox" />}
			disabled={disabled}
		/>
	);
};

export default EMICheckbox;
