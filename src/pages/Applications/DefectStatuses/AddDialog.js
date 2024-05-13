import React, { useState } from "react";
import API from "helpers/api";
import AddDialogStyle from "styles/application/AddDialogStyle";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import LinearProgress from "@mui/material/LinearProgress";
import * as yup from "yup";
import { handleValidateObj, generateErrorState } from "helpers/utils";
import { defectStatusTypes } from "helpers/constants";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import { showError } from "redux/common/actions";
import { connect, useDispatch } from "react-redux";

// Init styled components
const ADD = AddDialogStyle();

// Yup validation schema
const schema = yup.object({
	name: yup
		.string("This field must be a string")
		.required("This field is required"),
	type: yup
		.string("This field must be a string")
		.required("This field is required"),
});

// Default state schemas
const defaultErrorSchema = { name: null, type: null };
const defaultStateSchema = { name: "", type: "O" };

const AddDialog = ({
	open,
	closeHandler,
	applicationID,
	handleAddData,
	getError,
}) => {
	// Init state
	const [isUpdating, setIsUpdating] = useState(false);
	const [input, setInput] = useState(defaultStateSchema);
	const [errors, setErrors] = useState(defaultErrorSchema);
	const dispatch = useDispatch();

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
			dispatch(showError("Failed to add defect risk rating."));
		}
	};
	const handleCreateData = async () => {
		// Attempting to create
		try {
			// Submitting to backend
			const result = await API.post("/api/ApplicationDefectStatuses", {
				applicationId: applicationID,
				name: input.name,
				type: input.type,
			});

			// Handling success
			if (result.status === 201) {
				// Adding new type to state
				handleAddData({
					id: result.data,
					applicationID: applicationID,
					name: input.name,
					type: input.type,
				});

				return { success: true };
			} else {
				throw new Error(result);
			}
		} catch (err) {
			if (err.response?.data?.detail) {
				getError(
					err?.response?.data?.detail ||
						"Input should not be empty and it should be less than 50 characters ."
				);
			}
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
				aria-labelledby="alert-dialog-title"
				aria-describedby="alert-dialog-description"
			>
				{isUpdating ? <LinearProgress /> : null}

				<ADD.ActionContainer>
					<DialogTitle id="alert-dialog-title">
						{<ADD.HeaderText>Add New Defect Status</ADD.HeaderText>}
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
							<ADD.LeftInputContainer>
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
							</ADD.LeftInputContainer>

							<ADD.RightInputContainer>
								<ADD.InputLabel>
									Type<ADD.RequiredStar>*</ADD.RequiredStar>
								</ADD.InputLabel>
								<TextField
									sx={{
										"& .MuiInputBase-input.Mui-disabled": {
											WebkitTextFillColor: "#000000",
										},
									}}
									error={errors.type === null ? false : true}
									helperText={errors.type === null ? null : errors.type}
									fullWidth={true}
									select
									value={input.type}
									onChange={(e) => {
										setInput({ ...input, type: e.target.value });
									}}
									variant="outlined"
								>
									{defectStatusTypes.map((type) => (
										<MenuItem key={type.value} value={type.value}>
											{type.label}
										</MenuItem>
									))}
								</TextField>
							</ADD.RightInputContainer>
						</ADD.InputContainer>
					</div>
				</ADD.DialogContent>
			</Dialog>
		</div>
	);
};

const mapDispatchToProps = (dispatch) => ({
	getError: (message) => dispatch(showError(message)),
});
export default connect(null, mapDispatchToProps)(AddDialog);
