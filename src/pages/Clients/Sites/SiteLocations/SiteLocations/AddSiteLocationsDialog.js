import * as yup from "yup";
import React, { useState } from "react";
import Dialog from "@mui/material/Dialog";
import { makeStyles } from "tss-react/mui";
import { createTheme, ThemeProvider } from "@mui/styles";

import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import LinearProgress from "@mui/material/LinearProgress";
import AddDialogStyle from "styles/application/AddDialogStyle";
import {
	handleValidateObj,
	generateErrorState,
	getLocalStorageData,
} from "helpers/utils";
import { addSiteLocations } from "services/clients/sites/siteLocations";
import { showError } from "redux/common/actions";
import { useDispatch } from "react-redux";

// Init styled components
const ADD = AddDialogStyle();

// Yup validation schema
const schema = yup.object({
	name: yup
		.string("This field must be a string")
		.required("This field is required"),
});

// Default state schemas
const defaultErrorSchema = { name: null };
const defaultStateSchema = { name: "" };

const media = "@media (max-width: 414px)";

const useStyles = makeStyles()((theme) => ({
	dialogContent: {
		width: 500,
		[media]: {
			width: "100%",
		},
	},
	createButton: {
		width: "auto",
	},

	inputContainer: {
		width: "100%",
		display: "flex",
		flexDirection: "column",
		marginBottom: 20,
	},
}));

const AddLocationsDialog = ({
	open,
	closeHandler,
	createHandler,
	siteID,
	getError,
}) => {
	// Init hooks
	const { classes, cx } = useStyles();

	// Init state
	const [isUpdating, setIsUpdating] = useState(false);
	const [input, setInput] = useState(defaultStateSchema);
	const [errors, setErrors] = useState(defaultErrorSchema);
	const { customCaptions } = getLocalStorageData("me");
	const dispatch = useDispatch();

	// Handlers
	const closeOverride = () => {
		// Clearing input state and errors
		setInput(defaultStateSchema);
		setErrors(defaultErrorSchema);

		closeHandler();
	};
	const handleCreateProcess = async () => {
		// Adding progress indicator
		setIsUpdating(true);

		try {
			const localChecker = await handleValidateObj(schema, input);

			// Attempting API call if no local validaton errors
			if (!localChecker.some((el) => el.valid === false)) {
				// Creating new data
				const newData = await handleCreateData();

				if (newData.success) {
					setIsUpdating(false);
					closeOverride();
				} else {
					setErrors({ ...errors, ...newData.errors });
					setIsUpdating(false);
				}
			} else {
				const newErrors = generateErrorState(localChecker);
				setErrors({ ...errors, ...newErrors });
				setIsUpdating(false);
			}
		} catch (err) {
			// TODO: handle non validation errors here
			setIsUpdating(false);
			closeOverride();
			dispatch(showError(`Failed to add ${customCaptions?.location}.`));
		}
	};
	const handleEnterPress = (e) => {
		// 13 is the enter keycode
		if (e.keyCode === 13) {
			handleCreateProcess();
		}
	};

	const handleCreateData = async () => {
		// Attempting to create
		try {
			// Submitting to backend
			const result = await addSiteLocations({
				siteId: siteID,
				name: input.name,
			});

			// Handling success
			if (result.status) {
				// Adding new type to state
				createHandler({
					id: result.data,
					siteID: siteID,
					name: input.name,
				});

				return { success: true };
			} else {
				if (result.data.detail) {
					getError(result.data.detail);
					return {
						success: false,
						errors: {
							name: null,
						},
					};
				} else {
					return { success: false, errors: result.data.errors };
				}
			}
		} catch (err) {
			if (err.response.data.errors !== undefined) {
				setErrors({ ...errors, ...err.response.data.errors });
			} else {
				// If no explicit errors provided, throws to caller
				throw new Error(err);
			}

			return { success: false };
		}
	};

	return (
		<div>
			<Dialog
				fullWidth={true}
				maxWidth="md"
				open={open}
				onClose={closeOverride}
				aria-labelledby="alert-dialog-title"
				aria-describedby="alert-dialog-description"
			>
				{isUpdating ? <LinearProgress /> : null}

				<ADD.ActionContainer>
					<DialogTitle id="alert-dialog-title">
						{
							<ADD.HeaderText>
								Add {customCaptions?.location ?? "Location"}
							</ADD.HeaderText>
						}
					</DialogTitle>
					<ADD.ButtonContainer>
						<ADD.CancelButton onClick={closeOverride} variant="contained">
							Cancel
						</ADD.CancelButton>
						<ADD.ConfirmButton
							onClick={handleCreateProcess}
							variant="contained"
							className={classes.createButton}
						>
							Add {customCaptions?.location ?? "Location"}
						</ADD.ConfirmButton>
					</ADD.ButtonContainer>
				</ADD.ActionContainer>

				<DialogContent className={classes.dialogContent}>
					{/* <DialogContentText id="alert-dialog-description"> */}
					<div className={classes.inputContainer}>
						{/* <ADD.NameInputContainer> */}
						<ADD.NameLabel>
							Name<ADD.RequiredStar>*</ADD.RequiredStar>
						</ADD.NameLabel>
						<ADD.NameInput
							error={errors.name === null ? false : true}
							helperText={errors.name === null ? null : errors.name}
							required
							variant="outlined"
							value={input.name}
							onKeyDown={handleEnterPress}
							onChange={(e) => {
								setInput({ ...input, name: e.target.value });
							}}
							fullWidth
						/>
						{/* </ADD.NameInputContainer> */}
					</div>
					{/* </DialogContentText> */}
				</DialogContent>
			</Dialog>
		</div>
	);
};

export default AddLocationsDialog;
