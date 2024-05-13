import React from "react";
import PropTypes from "prop-types";
import { FormControlLabel, Switch, Typography } from "@mui/material";
import { withStyles } from "@mui/styles";
import { makeStyles } from "tss-react/mui";
import ColourConstants from "helpers/colourConstants";

const IOSSwitch = ({ name, onChange, currentStatus, disable, hideLabel }) => {
	const useStyles = makeStyles()((theme) => ({
		activeStatusSwitchText: {
			color: ColourConstants.confirmButton,
			fontFamily: "Roboto",
			fontSize: "13.5px",
		},
		inactiveStatusSwitchText: {
			color: ColourConstants.cancelButton,
			fontFamily: "Roboto",
			fontSize: "13.5px",
		},
	}));

	const SwitchButton = withStyles((theme) => ({
		root: {
			width: 42,
			height: 26,
			padding: 0,
			margin: theme.spacing(1),
		},

		switchBase: {
			"&$checked $track": {
				backgroundColor: "white",
			},
			padding: 1,
			"&$checked": {
				transform: "translateX(16px)",
				color: theme.palette.common.white,
				"& + $track": {
					backgroundColor: ColourConstants.confirmButton,
					opacity: 1,
					border: "none",
				},
			},
			"&$focusVisible $thumb": {
				color: ColourConstants.confirmButton,
				border: "6px solid #fff",
			},
		},
		thumb: {
			width: 24,
			height: 24,
			backgroundColor: "white",
		},
		track: {
			backgroundColor: ColourConstants.cancelButton,
			borderRadius: 26 / 2,
			border: `1px solid ${theme.palette.grey[400]}`,
			opacity: 1,
			transition: theme.transitions.create(["background-color", "border"]),
		},
		checked: {},
		focusVisible: {},
	}))(({ classes, ...props }) => {
		return (
			<Switch
				focusVisibleClassName={classes.focusVisible}
				disableRipple
				classes={{
					root: classes.root,
					switchBase: classes.switchBase,
					thumb: classes.thumb,
					track: classes.track,
					checked: classes.checked,
				}}
				{...props}
			/>
		);
	});

	const { classes } = useStyles();
	return (
		<FormControlLabel
			className={classes.statusSwitch}
			control={
				<SwitchButton
					checked={currentStatus}
					onChange={onChange}
					name={name}
					disabled={disable}
				/>
			}
			label={
				!hideLabel && (
					<Typography
						className={
							classes?.[
								currentStatus
									? "activeStatusSwitchText"
									: "inactiveStatusSwitchText"
							]
						}
					>
						{currentStatus ? "Active" : "Inactive"}
					</Typography>
				)
			}
		/>
	);
};

export default IOSSwitch;

IOSSwitch.defaultProps = {
	name: "status",
};

IOSSwitch.propTypes = {
	name: PropTypes.string,
	onChange: PropTypes.func.isRequired,
	currentStatus: PropTypes.bool.isRequired,
};
