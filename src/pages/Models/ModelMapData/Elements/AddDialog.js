import React, { useState } from "react";
import { Dialog, LinearProgress, DialogTitle } from "@mui/material";
import * as yup from "yup";
import AddDialogStyle from "styles/application/AddDialogStyle";
import { handleValidateObj, generateErrorState } from "helpers/utils";

const ADD = AddDialogStyle();

const schema = yup.object({
	text: yup
		.string("This field must be a string")
		.required("This field is required"),
});

const AddDialog = ({ addComplete, setAddNew, addNew, isUpdating }) => {
	const [errors, setErrors] = useState({ text: null });

	const handleClose = () => {
		setAddNew({ open: false, text: "" });
	};

	const addNewConfirm = async () => {
		// Validate input field and send text to api thrupgh addComplete props in parent component
		const localChecker = await handleValidateObj(schema, { text: addNew.text });
		if (!localChecker.some((el) => el.valid === false)) {
			addComplete(addNew.text);
		} else {
			const newErrors = generateErrorState(localChecker);
			setErrors({ ...errors, ...newErrors });
		}
	};

	const handleEnterPress = (e) => {
		if (e.keyCode === 13) {
			addNewConfirm();
		}
	};
	return (
		<Dialog
			fullWidth={true}
			maxWidth="md"
			open={addNew.open}
			onClose={handleClose}
			aria-labelledby="title"
			aria-describedby="description"
		>
			{isUpdating ? <LinearProgress /> : null}

			<ADD.ActionContainer>
				<DialogTitle id="alert-dialog-title">
					{<ADD.HeaderText>Add New Name</ADD.HeaderText>}
				</DialogTitle>
				<ADD.ButtonContainer>
					<ADD.CancelButton onClick={handleClose} variant="contained">
						Cancel
					</ADD.CancelButton>
					<ADD.ConfirmButton variant="contained" onClick={addNewConfirm}>
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
								error={errors.text === null ? false : true}
								helperText={errors.text === null ? null : errors.text}
								variant="outlined"
								value={addNew.text}
								autoFocus
								onKeyDown={handleEnterPress}
								onChange={(e) => {
									const { value } = e.target;
									setAddNew((th) => ({ ...th, text: value }));
								}}
							/>
						</ADD.NameInputContainer>
					</ADD.InputContainer>
				</div>
			</ADD.DialogContent>
		</Dialog>
	);
};

export default AddDialog;
