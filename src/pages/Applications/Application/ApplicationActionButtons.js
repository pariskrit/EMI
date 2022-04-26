import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { withStyles } from "@material-ui/core/styles";
import ActionButtonStyle from "styles/application/ActionButtonStyle";
import API from "helpers/api";
import CircularProgress from "@material-ui/core/CircularProgress";
import Typography from "@material-ui/core/Typography";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
import Button from "@material-ui/core/Button";
import DuplicateApplicationDialog from "./DuplicateApplicationDialog";
import ColourConstants from "helpers/colourConstants";

const AAB = ActionButtonStyle();

const useStyles = makeStyles((theme) => ({
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

const ActionButtons = ({
	id,
	handleRedirect,
	handleSave,
	isSaving,
	currentStatus,
	handleUpdateIsActive,
}) => {
	// Init hooks
	const classes = useStyles();

	// Init state
	const [isUpdating, setIsUpdating] = useState(false);
	const [openDuplicateDialog, setOpenDuplicateDialog] = useState(false);

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
			console.log(err);

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
		<AAB.ButtonContainer className="actionButtonContainer">
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

			<AAB.GeneralButton
				disableElevation
				variant="contained"
				className={`${classes.duplicateButton} actionButtonsBtn`}
				onClick={() => {
					handleDuplicateDialogOpen();
				}}
			>
				Duplicate
			</AAB.GeneralButton>

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
