import React from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { makeStyles } from "tss-react/mui";
import RestoreIcon from "@mui/icons-material/Restore";
import NavDetails from "components/Elements/NavDetails";
import "pages/Applications/CustomCaptions/customCaptions.css";
import ActionButtonStyle from "styles/application/ActionButtonStyle";
import Typography from "@mui/material/Typography";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import { withStyles } from "@mui/styles";
import ColourConstants from "helpers/colourConstants";
import IOSSwitch from "components/Elements/IOSSwitch";
import { setHistoryDrawerState } from "redux/common/actions";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import { getLocalStorageData } from "helpers/utils";
import roles from "helpers/roles";
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

const useStyles = makeStyles()((theme) => ({
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
}));

// Active/Inactive updating state switch
const IOSSwitchUpdated = withStyles((theme) => ({
	root: {
		width: 42,
		height: 26,
		padding: 0,
		margin: theme.spacing(1),
	},
	switchBase: {
		"&$checked $thumb": {
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
			"& + $thumb": {
				backgroundColor: "blue",
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
	current,
	createdDateTime,
	createdUserName,
	siteAppID,
}) => {
	const { classes } = useStyles();
	const importButton = {
		"&.MuiButton-root": {
			backgroundColor: "#ED8738",
		},
	};
	const dispatch = useDispatch();
	let showCreated = current !== "Profile";
	const location = useLocation();
	const isUserProfilePage = location.pathname.includes("me");
	const { role } = getLocalStorageData("me");

	return (
		<ThemeProvider theme={theme}>
			<div>
				<div className={"topContainerCustomCaptions"}>
					<NavDetails
						status={!isUserProfilePage && status}
						state={{
							statusColor: currentStatus ? "#24BA78" : "red",
							modelStatusName: currentStatus ? "Active" : "Inactive",
						}}
						staticCrumbs={crumbs}
						showCreatedByAt={showCreated}
						time={createdDateTime}
						userName={createdUserName}
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
								<AT.GeneralButton sx={importButton} onClick={onPasswordReset}>
									Reset Password
								</AT.GeneralButton>
							)}
							{showDuplicate && (
								<AT.GeneralButton sx={importButton} onClick={onDuplicate}>
									Duplicate
								</AT.GeneralButton>
							)}
							{showImport && (
								<AT.GeneralButton sx={importButton} onClick={onImport}>
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
							{showHistory && role !== roles.clientAdmin && (
								<div
									className="restore"
									onClick={() => dispatch(setHistoryDrawerState(true))}
								>
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
