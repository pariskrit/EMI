import * as yup from "yup";
import Dialog from "@mui/material/Dialog";
import React, { useState, useEffect } from "react";
import DialogTitle from "@mui/material/DialogTitle";
import LinearProgress from "@mui/material/LinearProgress";
import EditDialogStyle from "styles/application/EditDialogStyle";
import {
	handleValidateObj,
	generateErrorState,
	getLocalStorageData,
} from "helpers/utils";
import { editSiteLocations } from "services/clients/sites/siteLocations";
import { showError } from "redux/common/actions";
import { useDispatch } from "react-redux";

// Init styled components
const AED = EditDialogStyle();

// Yup validation schema
const schema = yup.object({
	name: yup
		.string("This field must be a string")
		.required("This field is required"),
});

// Default state schemas
const defaultErrorSchema = { name: null };
const defaultStateSchema = { name: "" };

const EditDialog = ({ open, closeHandler, data, handleEditData, getError }) => {
	// Init state
	const [isUpdating, setIsUpdating] = useState(false);
	const [input, setInput] = useState(defaultStateSchema);
	const [errors, setErrors] = useState(defaultErrorSchema);
	const { customCaptions } = getLocalStorageData("me");
	const dispatch = useDispatch();

	// Handlers
	const closeOverride = () => {
		// Updating local state and clearing errors
		setErrors(defaultErrorSchema);

		closeHandler();
	};
	const handleSave = async () => {
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
					setErrors({ ...errors, ...updatedData.errors });
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
			dispatch(showError(`Failed to Edit ${customCaptions?.location}.`));
		}
	};
	const handleUpdateData = async () => {
		// Attempting to update data
		try {
			// Making patch to backend
			const result = await editSiteLocations(data.id, [
				{
					op: "replace",
					path: "name",
					value: input.name,
				},
			]);

			// Handling success
			if (result.status) {
				// Updating state to match DB
				handleEditData({
					id: data.id,
					name: input.name,
				});

				return { success: true };
			} else {
				// If not success, throwing error
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

	const handleEnterPress = (e) => {
		// 13 is the enter keycode
		if (e.keyCode === 13) {
			handleSave();
		}
	};

	// Updating name after SC set
	useEffect(() => {
		if (data !== null && open) {
			setInput({ name: data.name });
		}
	}, [data, open]);

	return (
		<div>
			<Dialog
				fullWidth={true}
				maxWidth="md"
				open={open}
				onClose={closeHandler}
				aria-labelledby="alert-dialog-title"
				aria-describedby="alert-dialog-description"
			>
				{isUpdating ? <LinearProgress /> : null}

				<AED.ActionContainer>
					<DialogTitle id="alert-dialog-title">
						{
							<AED.HeaderText>
								Edit {customCaptions?.location ?? "Location"}
							</AED.HeaderText>
						}
					</DialogTitle>
					<AED.ButtonContainer>
						<AED.CancelButton onClick={closeHandler} variant="contained">
							Cancel
						</AED.CancelButton>
						<AED.ConfirmButton variant="contained" onClick={handleSave}>
							Save
						</AED.ConfirmButton>
					</AED.ButtonContainer>
				</AED.ActionContainer>

				<AED.DialogContent>
					<div>
						<AED.InputContainer>
							<AED.NameInputContainer>
								<AED.NameLabel>
									Name<AED.RequiredStar>*</AED.RequiredStar>
								</AED.NameLabel>
								<AED.NameInput
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
							</AED.NameInputContainer>
						</AED.InputContainer>
					</div>
				</AED.DialogContent>
			</Dialog>
		</div>
	);
};

export default EditDialog;
