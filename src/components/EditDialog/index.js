import React from "react";
import PropTypes from "prop-types";
import EditDialogStyle from "styles/application/EditDialogStyle";
import Dialog from "@material-ui/core/Dialog";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import LinearProgress from "@material-ui/core/LinearProgress";
import * as yup from "yup";

// Init styled components
const AED = EditDialogStyle();

function EditDialog({ open, title, inputFieldLists, errors, handleSave }) {
	const handleEnterPress = (e) => {
		// 13 is the enter keycode
		if (e.keyCode === 13) {
			handleSave();
		}
	};
	return (
		<Dialog
			fullWidth={true}
			maxWidth="md"
			open={open}
			// onClose={closeOverride}
			aria-labelledby="edit-title"
			aria-describedby="edit-description"
		>
			{/* {isUpdating ? <LinearProgress /> : null} */}

			<AED.ActionContainer>
				<DialogTitle id="alert-dialog-title">
					{<AED.HeaderText>Edit {title}</AED.HeaderText>}
				</DialogTitle>
				<AED.ButtonContainer>
					<AED.CancelButton onClick="" variant="contained">
						Cancel
					</AED.CancelButton>
					<AED.ConfirmButton variant="contained" onClick="">
						Save
					</AED.ConfirmButton>
				</AED.ButtonContainer>
			</AED.ActionContainer>

			<AED.DialogContent>
				<DialogContentText id="alert-dialog-description">
					<AED.InputContainer>
						{inputFieldLists.map((input, index) => (
							<AED.FieldInputContainer>
								<AED.NameLabel>
									{input.label}
									<AED.RequiredStar>*</AED.RequiredStar>
								</AED.NameLabel>
								<AED.NameInput
									error={errors[index].isError}
									helperText={
										errors[index].isError ? errors[index].message : null
									}
									variant="outlined"
									value={input.value}
									autoFocus
									onKeyDown={handleEnterPress}
									// onChange={(e) => {
									// 	setInput({ ...input, name: e.target.value });
									// }}
								/>
							</AED.FieldInputContainer>
						))}
					</AED.InputContainer>
				</DialogContentText>
			</AED.DialogContent>
		</Dialog>
	);
}

EditDialog.propTypes = {};

export default EditDialog;
