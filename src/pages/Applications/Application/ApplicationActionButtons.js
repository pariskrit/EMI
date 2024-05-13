import React, { useState } from "react";
import { makeStyles } from "tss-react/mui";
import { createTheme, ThemeProvider } from "@mui/styles";

import { withStyles } from "@mui/styles";
import ActionButtonStyle from "styles/application/ActionButtonStyle";
import API from "helpers/api";
import Typography from "@mui/material/Typography";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import DuplicateApplicationDialog from "./DuplicateApplicationDialog";
import ColourConstants from "helpers/colourConstants";
import { setHistoryDrawerState, showError } from "redux/common/actions";
import { useDispatch } from "react-redux";
import { RESELLER_ID } from "constants/UserConstants/indes";
import RestoreIcon from "@mui/icons-material/Restore";
import { useSelector } from "react-redux";
import HistoryBar from "components/Modules/HistorySidebar/HistoryBar";
import { getApplicationDetails } from "services/History/application";

const AAB = ActionButtonStyle();

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
	duplicateButton: {
		backgroundColor: ColourConstants.duplicateButton,
	},
	// spinnerButton: {
	// 	marginRight: 10,
	// 	width: 150,
	// 	backgroundColor: "transparent",
	// },
}));

// Active/Inactive switch
const IOSSwitch = withStyles((theme) => ({
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

const ActionButtons = ({
	id,
	handleRedirect,
	handleSave,
	isSaving,
	currentStatus,
	handleUpdateIsActive,
	adminType,
}) => {
	// Init hooks
	const { classes, cx } = useStyles();

	// Init state
	const [isUpdating, setIsUpdating] = useState(false);
	const [openDuplicateDialog, setOpenDuplicateDialog] = useState(false);
	const dispatch = useDispatch();
	const { isHistoryDrawerOpen } = useSelector((state) => state.commonData);

	// Handlers
	const handlePatchIsActive = async () => {
		// Setting spinner
		setIsUpdating(true);

		try {
			// Updating isActive on backend
			let patched = await API.patch(`/api/Applications/${id}`, [
				{
					op: "replace",
					path: "isActive",
					value: !currentStatus,
				},
			]);

			// Handling success
			if (patched.status === 200) {
				handleUpdateIsActive(!currentStatus);

				// Removing spinner
				setIsUpdating(false);

				return true;
			} else {
				throw new Error(patched);
			}
		} catch (err) {
			// TODO: real error handling
			dispatch(showError("Failed to update active status."));

			// Removing spinner
			setIsUpdating(false);

			return false;
		}
	};
	const handleDuplicateDialogOpen = (id) => {
		setOpenDuplicateDialog(true);
	};
	const handleDuplicateDialogClose = () => {
		setOpenDuplicateDialog(false);
	};
	const handleDuplicateData = async (id, input) => {
		// Attempting to create application
		try {
			// Sending create POST to backend
			let result = await API.post(`/api/Applications/${id}/duplicate`, input);

			if (result.status === 201 || result.status === 200) {
				// Getting response
				result = result.data;

				// Redirecting page
				handleRedirect(result);

				return { success: true };
			} else {
				// Throwing response if error
				throw new Error(result);
			}
		} catch (err) {
			if (err.response.data.errors !== undefined) {
				return { success: false, errors: err.response.data.errors };
			} else {
				// If no explicit errors provided, throws to caller
				throw new Error(err);
			}
		}
	};

	return (
		<AAB.ButtonContainer
			className="actionButtonContainer"
			style={{ display: "flex", alignItems: "flex-start" }}
		>
			<HistoryBar
				id={id}
				showhistorybar={isHistoryDrawerOpen}
				dispatch={dispatch}
				fetchdata={(id, pageNumber, pageSize) =>
					getApplicationDetails(id, pageNumber, pageSize)
				}
			/>
			<DuplicateApplicationDialog
				open={openDuplicateDialog}
				closeHandler={handleDuplicateDialogClose}
				duplicateHandler={handleDuplicateData}
				id={id}
			/>

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
							<Typography className={classes.inactiveStatusSwitchText}>
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
							disabled={adminType === RESELLER_ID}
						/>
					}
					label={
						currentStatus ? (
							<Typography className={classes.activeStatusSwitchText}>
								Active
							</Typography>
						) : (
							<Typography className={classes.inactiveStatusSwitchText}>
								Inactive
							</Typography>
						)
					}
				/>
			)}

			{adminType !== RESELLER_ID && (
				<AAB.GeneralButton
					sx={{
						"&.MuiButton-root": {
							backgroundColor: ColourConstants.duplicateButton,
							color: "#ffffff",
						},
					}}
					disableElevation
					variant="contained"
					className={cx(classes.duplicateButton, "actionButtonsBtn")}
					onClick={() => {
						handleDuplicateDialogOpen();
					}}
				>
					Duplicate
				</AAB.GeneralButton>
			)}
			<div
				className="restore"
				onClick={() => dispatch(setHistoryDrawerState(true))}
			>
				<RestoreIcon className={classes.restore} />
			</div>

			{/* Rendering button with spinner if saving currently happening */}
			{/* {isSaving ? (
				<Button
					disableElevation
					variant="contained"
					className="actionSpinnerBtn"
				>
					<CircularProgress size={23} />
				</Button>
			) : (
				<AAB.GeneralButton
					disableElevation
					variant="contained"
					onClick={handleSave}
					className="actionButtonsBtn"
				>
					Save
				</AAB.GeneralButton>
			)} */}
		</AAB.ButtonContainer>
	);
};

export default ActionButtons;
