import React, { useState } from "react";
import API from "helpers/api";
import AddDialogStyle from "styles/application/AddDialogStyle";
import Dialog from "@material-ui/core/Dialog";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import LinearProgress from "@material-ui/core/LinearProgress";
import * as yup from "yup";
import { handleValidateObj, generateErrorState } from "helpers/utils";

// Init styled components
const ADD = AddDialogStyle();

function AddDialog({
	open,
	isUpdating,
	title,
	inputFieldLists,
	handleAddClick,
	handleClose,
}) {
	const handleEnterPress = (e) => {
		// 13 is the enter keycode
		if (e.keyCode === 13) {
			handleAddClick();
		}
	};
	return (
		<Dialog
			fullWidth={true}
			maxWidth="md"
			open={open}
			onClose={handleClose}
			aria-labelledby="add-title"
			aria-describedby="add-description"
		>
			{isUpdating ? <LinearProgress /> : null}

			<ADD.ActionContainer>
				<DialogTitle id="alert-dialog-title">
					<ADD.HeaderText>Add New {title}</ADD.HeaderText>
				</DialogTitle>
				<ADD.ButtonContainer>
					<ADD.CancelButton onClick={handleClose} variant="contained">
						Cancel
					</ADD.CancelButton>
					<ADD.ConfirmButton variant="contained" onClick={handleAddClick}>
						Add New
					</ADD.ConfirmButton>
				</ADD.ButtonContainer>
			</ADD.ActionContainer>

			<ADD.DialogContent>
				<DialogContentText id="alert-dialog-description">
					<ADD.InputContainer>
						{inputFieldLists.map(({ label, value, error }, index) => (
							<ADD.FieldInputContainer key={index}>
								<ADD.NameLabel>
									{label}
									<ADD.RequiredStar>*</ADD.RequiredStar>
								</ADD.NameLabel>
								<ADD.NameInput
									error={error.isError}
									helperText={error.isError ? error.message : null}
									variant="outlined"
									value={value}
									autoFocus
									onKeyDown={handleEnterPress}
									// onChange={(e) => {
									// 	setInput({ ...input, name: e.target.value });
									// }}
								/>
							</ADD.FieldInputContainer>
						))}
					</ADD.InputContainer>
				</DialogContentText>
			</ADD.DialogContent>
		</Dialog>
	);
}

export default AddDialog;
