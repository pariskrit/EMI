import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Checkbox from "@material-ui/core/Checkbox";

// Import icons
import CheckboxOff from "assets/icons/checkbox-off.svg";
import CheckboxOn from "assets/icons/checkbox-on-with-tick.svg";

const useStyles = makeStyles((theme) => ({
	emiCheckbox: {
		transform: "scale(0.9)",
	},
}));

const EMICheckbox = ({ state, changeHandler }) => {
	// Init hooks
	const classes = useStyles();

	return (
		<Checkbox
			className={classes.emiCheckbox}
			checked={state}
			onChange={() => {
				changeHandler();
			}}
			icon={<img src={CheckboxOff} alt="unticked checkbox" />}
			checkedIcon={<img src={CheckboxOn} alt="ticked checkbox" />}
		/>
	);
};

export default EMICheckbox;
