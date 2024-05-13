import * as yup from "yup";
import React, { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import LinearProgress from "@mui/material/LinearProgress";
import AddDialogStyle from "styles/application/AddDialogStyle";
import { handleValidateObj, generateErrorState } from "helpers/utils";

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

const AddDialog = ({
	open,
	closeHandler,
	applicationID,
	handleAddData,
	getError,
	subHeader,
	postAPI,
}) => {
	// Init state
	const [isUpdating, setIsUpdating] = useState(false);
	const [input, setInput] = useState(defaultStateSchema);
	const [errors, setErrors] = useState(defaultErrorSchema);

	// Handlers
	const closeOverride = () => {
		// Clearing input state and errors
		setInput(defaultStateSchema);
		setErrors(defaultErrorSchema);

		closeHandler();
	};
	const handleAddClick = async () => {
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
			getError(err);

			setIsUpdating(false);
			closeOverride();
		}
	};
	const handleCreateData = async () => {
		// Attempting to create data
		try {
			const newData = await postAPI({
				siteAppID: applicationID,
				name: input.name,
			});

			// Handling success
			if (newData.status) {
				// Adding data to state
				handleAddData({
					id: newData.data,
					siteAppID: applicationID,
					name: input.name,
				});

				return { success: true };
			} else {
				if (newData.data.detail) {
					// getError(newData.data.detail);
					getError(`${subHeader} already exists.`);
					return {
						success: false,
						errors: {
							name: null,
						},
					};
				} else {
					return { success: false, errors: { ...newData.data.errors } };
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

	const handleEnterPress = (e) => {
		// 13 is the enter keycode
		if (e.keyCode === 13) {
			handleAddClick();
		}
	};

	return (
		<div>
			<Dialog
				fullWidth={true}
				maxWidth="md"
				open={open}
				onClose={closeOverride}
				aria-labelledby="add-title"
				aria-describedby="add-description"
			>
				{isUpdating ? <LinearProgress /> : null}

				<ADD.ActionContainer>
					<DialogTitle id="alert-dialog-title">
						{<ADD.HeaderText>Add New {subHeader}</ADD.HeaderText>}
					</DialogTitle>
					<ADD.ButtonContainer>
						<ADD.CancelButton onClick={closeOverride} variant="contained">
							Cancel
						</ADD.CancelButton>
						<ADD.ConfirmButton variant="contained" onClick={handleAddClick}>
							Add New
						</ADD.ConfirmButton>
					</ADD.ButtonContainer>
				</ADD.ActionContainer>

				<ADD.DialogContent>
					<div>
						<ADD.InputContainer>
							<ADD.NameInputContainer>
								<ADD.NameLabel>
									Name<ADD.RequiredStar>*</ADD.RequiredStar>
								</ADD.NameLabel>
								<ADD.NameInput
									error={errors.name === null ? false : true}
									helperText={errors.name === null ? null : errors.name}
									variant="outlined"
									value={input.name}
									autoFocus
									onKeyDown={handleEnterPress}
									onChange={(e) => {
										setInput({ ...input, name: e.target.value });
									}}
								/>
							</ADD.NameInputContainer>
						</ADD.InputContainer>
					</div>
				</ADD.DialogContent>
			</Dialog>
		</div>
	);
};

export default AddDialog;
