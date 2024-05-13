import React, { useState } from "react";
import API from "helpers/api";
import AddDialogStyle from "styles/application/AddDialogStyle";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import LinearProgress from "@mui/material/LinearProgress";
import EMICheckbox from "components/Elements/EMICheckbox";
import * as yup from "yup";
import { handleValidateObj, generateErrorState } from "helpers/utils";
import { showError } from "redux/common/actions";
import { connect, useDispatch } from "react-redux";
import ColourConstants from "helpers/colourConstants";

// Init styled components
const ADD = AddDialogStyle();

// Yup validation schema
const schema = yup.object({
	name: yup
		.string("This field must be a string")
		.required("This field is required"),
	defects: yup
		.boolean("This field must be a boolean (true or false)")
		.required("This field is required"),
});

// Default state schemas
const defaultErrorSchema = { name: null, defects: null };
const defaultStateSchema = { name: "", defects: false };

const AddRoleDialog = ({
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
			dispatch(showError("Failed to add role."));

			setIsUpdating(false);
			closeOverride();
		}
	};
	const handleCreateData = async () => {
		// Attempting to create member
		try {
			const result = await API.post("/api/ApplicationRoles", {
				applicationId: applicationID,
				name: input.name,
				canRegisterDefects: input.defects,
			});

			// Handling success
			if (result.status === 201) {
				// Adding new member to state
				handleAddData({
					id: result.data,
					applicationID: applicationID,
					name: input.name,
					canRegisterDefects: input.defects,
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
				aria-labelledby="add-title"
				aria-describedby="add-description"
			>
				{isUpdating ? <LinearProgress /> : null}

				<ADD.ActionContainer>
					<DialogTitle id="add-dialog-title">
						{<ADD.HeaderText>Add New Role</ADD.HeaderText>}
					</DialogTitle>
					<ADD.ButtonContainer>
						<ADD.CancelButton
							onClick={closeOverride}
							variant="contained"
							sx={{
								"&.MuiButton-root:hover": {
									backgroundColor: ColourConstants.deleteDialogHover,
									color: "#ffffff",
								},
							}}
						>
							Cancel
						</ADD.CancelButton>
						<ADD.ConfirmButton
							variant="contained"
							onClick={handleAddClick}
							sx={{
								"&.MuiButton-root:hover": {
									backgroundColor: ColourConstants.deleteDialogHover,
									color: "#ffffff",
								},
							}}
						>
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

							<ADD.CheckboxContainer>
								<ADD.CheckboxLabel>
									<EMICheckbox
										state={input.defects}
										changeHandler={() => {
											setInput({
												...input,
												defects: !input.defects,
											});
										}}
									/>
									Can Role register defects?
								</ADD.CheckboxLabel>
							</ADD.CheckboxContainer>
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
export default connect(null, mapDispatchToProps)(AddRoleDialog);
