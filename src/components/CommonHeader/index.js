import {
	createMuiTheme,
	makeStyles,
	ThemeProvider,
} from "@material-ui/core/styles";
import RestoreIcon from "@material-ui/icons/Restore";
import NavDetails from "components/NavDetails";
import PropTypes from "prop-types";
import React from "react";
import "routes/Applications/CustomCaptions/customCaptions.css";
import ActionButtonStyle from "styles/application/ActionButtonStyle";
import Typography from "@material-ui/core/Typography";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
import { withStyles } from "@material-ui/core/styles";
import ColourConstants from "helpers/colourConstants";
import NavButtons from "components/NavButtons";

const AT = ActionButtonStyle();

const theme = createMuiTheme({
	overrides: {
		// Accordion override is making the accordion title static vs. default dynamic
		MuiAccordionSummary: {
			root: {
				height: 48,
				"&$expanded": {
					height: 48,
					minHeight: 48,
				},
			},
		},
	},
});

const media = "@media (max-width: 414px)";

const useStyles = makeStyles({
	statusSwitch: {
		marginRight: 15,
	},
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
	restore: {
		border: "2px solid",
		borderRadius: "100%",
		height: "35px",
		width: "35px",
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		color: "#307ad6",
	},
	importButton: {
		background: "#ED8738",
	},
	buttons: {
		display: "flex",
		marginLeft: "auto",
		[media]: {
			marginLeft: "0px",
		},
	},
	wrapper: {
		display: "flex",
		alignItems: "flex-start",
		[media]: {
			marginTop: "10px",
			justifyContent: "space-between",
		},
	},
});

// Active/Inactive switch
const IOSSwitch = withStyles((theme) => ({
	root: {
		width: 42,
		height: 26,
		padding: 0,
		margin: theme.spacing(1),
	},
	switchBase: {
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
	},
	track: {
		borderRadius: 26 / 2,
		border: `1px solid ${theme.palette.grey[400]}`,
		backgroundColor: ColourConstants.cancelButton,
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
// Active/Inactive updating state switch
const IOSSwitchUpdated = withStyles((theme) => ({
	root: {
		width: 42,
		height: 26,
		padding: 0,
		margin: theme.spacing(1),
	},
	switchBase: {
		padding: 1,
		"&$checked": {
			transform: "translateX(16px)",
			color: theme.palette.common.white,
			"& + $track": {
				backgroundColor: theme.palette.grey[400],
				opacity: 1,
				border: "none",
			},
		},
		"&$focusVisible $thumb": {
			color: theme.palette.grey[400],
			border: "6px solid #fff",
		},
	},
	thumb: {
		width: 24,
		height: 24,
	},
	track: {
		borderRadius: 26 / 2,
		border: `1px solid ${theme.palette.grey[400]}`,
		backgroundColor: theme.palette.grey[400],
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

const SiteWrapper = ({
	status,
	lastSaved,
	onClickAdd,
	onClickSave,
	onDuplicate,
	showAdd,
	showDuplicate,
	showHistory,
	showSave,
	showSwitch,
	crumbs,
	isUpdating,
	currentStatus,
	handlePatchIsActive,
	navigation,
	data,
}) => {
	const classes = useStyles();

	return (
		<ThemeProvider theme={theme}>
			<div className="container">
				<div className={"topContainerCustomCaptions"}>
					<NavDetails
						status={status}
						lastSaved={lastSaved}
						staticCrumbs={crumbs}
					/>
					<div
						className={
							showAdd || showDuplicate || showHistory || showSave || showSwitch
								? classes.wrapper
								: ""
						}
					>
						{showSwitch && (
							<div>
								{isUpdating ? (
									<FormControlLabel
										className={classes.statusSwitch}
										control={
											<IOSSwitchUpdated
												checked={currentStatus}
												onChange={() => null}
												name="status"
											/>
										}
										label={
											currentStatus ? (
												<Typography className={classes.activeStatusSwitchText}>
													Active
												</Typography>
											) : (
												<Typography
													className={classes.inactiveStatusSwitchText}
												>
													Inactive
												</Typography>
											)
										}
									/>
								) : (
									<FormControlLabel
										className={classes.statusSwitch}
										control={
											<IOSSwitch
												checked={currentStatus}
												onChange={handlePatchIsActive}
												name="status"
											/>
										}
										label={
											currentStatus ? (
												<Typography className={classes.activeStatusSwitchText}>
													Active
												</Typography>
											) : (
												<Typography
													className={classes.inactiveStatusSwitchText}
												>
													Inactive
												</Typography>
											)
										}
									/>
								)}
							</div>
						)}
						<div className={classes.buttons}>
							{showDuplicate && (
								<AT.GeneralButton
									onClick={onDuplicate}
									className={classes.importButton}
								>
									Duplicate
								</AT.GeneralButton>
							)}
							{showAdd && (
								<AT.GeneralButton onClick={onClickAdd}>
									Add New
								</AT.GeneralButton>
							)}
							{showSave && (
								<AT.GeneralButton onClick={onClickSave}>Save</AT.GeneralButton>
							)}
						</div>
						{showHistory && (
							<div className="restore">
								<RestoreIcon className={classes.restore} />
							</div>
						)}
					</div>
				</div>

				<NavButtons
					navigation={navigation}
					applicationName={data.name}
					current="Details"
				/>
				{/* <Component /> */}
			</div>
		</ThemeProvider>
	);
};

SiteWrapper.defaultProps = {
	crumbs: ["Parent", "Child", "so on.."],
	status: false,
	showAdd: false,
	showHistory: false,
	showSwitch: true,
};

export default SiteWrapper;