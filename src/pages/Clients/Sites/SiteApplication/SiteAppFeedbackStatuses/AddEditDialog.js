import React, { useState, useEffect } from "react";
import AddDialogStyle from "styles/application/AddDialogStyle";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import LinearProgress from "@mui/material/LinearProgress";
import * as yup from "yup";
import { handleValidateObj, generateErrorState } from "helpers/utils";
import FeedbackStatusTypes from "helpers/feedbackStatusTypes";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import {
	addFeedbackStatuses,
	patchFeedbackStatuses,
} from "services/clients/sites/siteApplications/feedbackStatuses";
import { showError } from "redux/common/actions";
import { useDispatch } from "react-redux";

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

const AddEditDialog = ({
	open,
	closeHandler,
	applicationID,
	handleAddData,
	editMode,
	handleEditData,
	data,
	getError,
	header,
}) => {
	// Init state
	const [isUpdating, setIsUpdating] = useState(false);
	const [input, setInput] = useState(defaultStateSchema);
	const [errors, setErrors] = useState(defaultErrorSchema);
	const dispatch = useDispatch();

	useEffect(() => {
		if (editMode) {
			setInput({ name: data.name, type: data.type });
		}
	}, [editMode, data]);

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
			dispatch(showError(`Failed to add ${header}.`));
		}
	};
	const handleCreateData = async () => {
		// Attempting to create
		try {
			// Submitting to backend

			const result = await addFeedbackStatuses({
				siteAppId: applicationID,
				name: input.name,
				type: input.type,
			});

			// Handling success
			if (result.status) {
				// Adding new type to state
				handleAddData({
					id: result.data,
					applicationID: applicationID,
					name: input.name,
					type: input.type,
					statusType: FeedbackStatusTypes[input.type],
				});

				return { success: true };
			} else {
				if (result.data.detail) {
					getError(result.data.detail);
				} else if (result.data.errors !== undefined) {
					setErrors({ ...errors, ...result.data.errors });
				} else {
					// If no explicit errors provided, throws to caller
					throw new Error(result);
				}

				return { success: false };
			}
		} catch (err) {
			dispatch(showError(`Failed to add  ${header}.`));
		}
	};

	const handleUpdate = async () => {
		// Adding progress indicator
		setIsUpdating(true);

		try {
			const localChecker = await handleValidateObj(schema, input);

			// Attempting API call if no local validaton errors
			if (!localChecker.some((el) => el.valid === false)) {
				// Updating data
				const updatedData = await handleUpdateData();

				if (updatedData.success) {
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
			dispatch(showError(`Failed to edit ${header}.`));
		}
	};

	const handleUpdateData = async () => {
		// Attempting to update data
		try {
			const result = await patchFeedbackStatuses(data.id, [
				{
					op: "replace",
					path: "name",
					value: input.name,
				},
				{
					op: "replace",
					path: "type",
					value: input.type,
				},
			]);

			// Handling success
			if (result.status) {
				// Updating state to match DB
				handleEditData({
					id: data.id,
					name: input.name,
					type: input.type,
					statusType: FeedbackStatusTypes[input.type],
				});

				return { success: true };
			} else {
				if (result.data.detail) {
					getError(result.data.detail);
				} else if (result.data.errors !== undefined) {
					setErrors({ ...errors, ...result.data.errors });
				} else {
					// If no explicit errors provided, throws to caller
					throw new Error(result);
				}

				return { success: false };
			}
		} catch (err) {
			dispatch(showError(`Failed to update ${header}.`));
		}
	};

	const handleSubmit = () => {
		if (!editMode) {
			handleAddClick();
		} else {
			handleUpdate();
		}
	};

	const handleEnterPress = (e) => {
		// 13 is the enter keycode
		if (e.keyCode === 13) {
			if (editMode) {
				handleUpdate();
			} else {
				handleAddClick();
			}
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
								{editMode ? "Edit" : "Add New"} {header}
							</ADD.HeaderText>
						}
					</DialogTitle>
					<ADD.ButtonContainer>
						<ADD.CancelButton onClick={closeOverride} variant="contained">
							Cancel
						</ADD.CancelButton>
						<ADD.ConfirmButton variant="contained" onClick={handleSubmit}>
							Save
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
									{Object.keys(FeedbackStatusTypes).map((key) => (
										<MenuItem key={key} value={key}>
											{FeedbackStatusTypes[key]}
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

export default AddEditDialog;
