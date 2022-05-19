import React from "react";
import {
	createTheme,
	makeStyles,
	ThemeProvider,
} from "@material-ui/core/styles";
import RestoreIcon from "@material-ui/icons/Restore";
import NavDetails from "components/Elements/NavDetails";
import "pages/Applications/CustomCaptions/customCaptions.css";
import ActionButtonStyle from "styles/application/ActionButtonStyle";
import Typography from "@material-ui/core/Typography";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
import { withStyles } from "@material-ui/core/styles";
import ColourConstants from "helpers/colourConstants";
import IOSSwitch from "components/Elements/IOSSwitch";

const AT = ActionButtonStyle();

const theme = createTheme({
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
			marginBottom: "10px",
			justifyContent: "space-between",
			zIndex: 1,
		},
	},
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

const CommonHeader = ({
	status,
	lastSaved,
	onClickAdd,
	onClickSave,
	onDuplicate,
	onImport,
	showAdd,
	showDuplicate,
	showHistory,
	showSave,
	showSwitch,
	showImport,
	crumbs,
	isUpdating,
	currentStatus,
	handlePatchIsActive,
	showPasswordReset,
	onPasswordReset,
}) => {
	const classes = useStyles();

	return (
		<ThemeProvider theme={theme}>
			<div>
				<div className={"topContainerCustomCaptions"}>
					<NavDetails
						status={status}
						state={{
							statusColor: currentStatus ? "#24BA78" : "red",
							modelStatusName: currentStatus ? "Active" : "Inactive",
						}}
						staticCrumbs={crumbs}
					/>
					<div
						className={
							showAdd || showDuplicate || showSave || showSwitch
								? classes.wrapper
								: ""
						}
					>
						{showSwitch && (
							<div style={{ marginLeft: "20px" }}>
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
												currentStatus={currentStatus}
												onChange={handlePatchIsActive}
												name="status"
											/>
										}
									/>
								)}
							</div>
						)}
						<div className={classes.buttons}>
							{showPasswordReset && (
								<AT.GeneralButton
									className={classes.importButton}
									onClick={onPasswordReset}
								>
									Reset Password
								</AT.GeneralButton>
							)}
							{showDuplicate && (
								<AT.GeneralButton
									onClick={onDuplicate}
									className={classes.importButton}
								>
									Duplicate
								</AT.GeneralButton>
							)}
							{showImport && (
								<AT.GeneralButton
									onClick={onImport}
									className={classes.importButton}
								>
									Import From List
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
							{showHistory && (
								<div className="restore">
									<RestoreIcon className={classes.restore} />
								</div>
							)}
						</div>
					</div>
				</div>
			</div>
		</ThemeProvider>
	);
};

CommonHeader.defaultProps = {
	crumbs: ["Parent", "Child", "so on.."],
	status: true,
	showAdd: false,
	showHistory: false,
	showSwitch: false,
	showDuplicate: false,
	showSave: false,
	showImport: false,
};

export default CommonHeader;
