import { createTheme, ThemeProvider } from "@mui/material/styles";
import { makeStyles } from "tss-react/mui";
import RestoreIcon from "@mui/icons-material/Restore";
import NavDetails from "components/Elements/NavDetails";
import React from "react";
import "pages/Applications/CustomCaptions/customCaptions.css";
import ActionButtonStyle from "styles/application/ActionButtonStyle";
import Typography from "@mui/material/Typography";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import { withStyles } from "@mui/styles";
import ColourConstants from "helpers/colourConstants";
import IOSSwitch from "components/Elements/IOSSwitch";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { setHistoryDrawerState } from "redux/common/actions";
import HistoryBar from "../HistorySidebar/HistoryBar";
import { getLocalStorageData } from "helpers/utils";
import { useLocation } from "react-router-dom";
import { getSiteAppHistory } from "constants/SiteApplication";
import {
	siteAppCustomCaptionsPath,
	siteAppDetailPath,
} from "helpers/routePaths";
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

const importButton = {
	"&.MuiButton-root": {
		backgroundColor: "#ED8738",
	},
};
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
	navigation,
	data,
	FullSettingAccess,
}) => {
	const { classes, cx } = useStyles();
	const dispatch = useDispatch();
	const { isHistoryDrawerOpen } = useSelector((state) => state.commonData);
	const { siteAppID, siteID } = getLocalStorageData("me");
	const location = useLocation();
	const siteAppRoute = location?.pathname?.split("/")?.at(-1);

	const historyApi = getSiteAppHistory(siteAppRoute);
	const { role } = getLocalStorageData("me");

	return (
		<ThemeProvider theme={theme}>
			{role === roles?.siteUser && (
				<HistoryBar
					id={siteAppID}
					showhistorybar={isHistoryDrawerOpen}
					dispatch={dispatch}
					fetchdata={(id, pageNumber, pageSize) =>
						siteAppRoute === siteAppDetailPath ||
						siteAppRoute === siteAppCustomCaptionsPath
							? historyApi(id, siteID, pageNumber, pageSize)
							: historyApi(id, pageNumber, pageSize)
					}
				/>
			)}
			<div>
				<div className={"topContainerCustomCaptions"}>
					<NavDetails status={status} staticCrumbs={crumbs} />
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
							{showAdd && FullSettingAccess && (
								<AT.GeneralButton onClick={onClickAdd}>
									Add New
								</AT.GeneralButton>
							)}
							{showSave && (
								<AT.GeneralButton onClick={onClickSave}>Save</AT.GeneralButton>
							)}
							{role === roles?.siteUser && (
								<div
									className="restore"
									style={{ alignSelf: "flex-start" }}
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
	crumbs: [],
	status: false,
	showAdd: false,
	showHistory: false,
	showSwitch: false,
	showDuplicate: false,
	showSave: false,
	showImport: false,
};

export default CommonHeader;
