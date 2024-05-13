import React from "react";
import PropTypes from "prop-types";
import EditDialogStyle from "styles/application/EditDialogStyle";
import Dialog from "@mui/material/Dialog";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import LinearProgress from "@mui/material/LinearProgress";
import * as yup from "yup";
import ColourConstants from "helpers/colourConstants";

// Init styled components
const AED = EditDialogStyle();

function EditDialog({
	open,
	title,
	inputFieldLists,
	errors,
	handleSave,
	isUpdating,
}) {
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
			{isUpdating ? <LinearProgress /> : null}

			<AED.ActionContainer>
				<DialogTitle id="alert-dialog-title">
					{<AED.HeaderText>Edit {title}</AED.HeaderText>}
				</DialogTitle>
				<AED.ButtonContainer>
					<AED.CancelButton
						onClick=""
						variant="contained"
						sx={{
							"&.MuiButton-root:hover": {
								backgroundColor: ColourConstants.deleteDialogHover,
								color: "#ffffff",
							},
						}}
					>
						Cancel
					</AED.CancelButton>
					<AED.ConfirmButton
						variant="contained"
						onClick={handleSave}
						sx={{
							"&.MuiButton-root:hover": {
								backgroundColor: ColourConstants.deleteDialogHover,
								color: "#ffffff",
							},
						}}
					>
						Save
					</AED.ConfirmButton>
				</AED.ButtonContainer>
			</AED.ActionContainer>

			<AED.DialogContent>
				<DialogContentText id="alert-dialog-description">
					<AED.InputContainer>
						{inputFieldLists.map((input, index) => (
							<AED.FieldInputContainer key={index}>
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

EditDialog.propTypes = {
	/** if true opens the dialog otherwise closes */
	open: PropTypes.bool.isRequired,

	/** the name of the data that you are going to edit */
	title: PropTypes.string.isRequired,

	/** array of objects containg input field details */
	inputFieldLists: PropTypes.array.isRequired,

	//** array of errors object */
	errors: PropTypes.array.isRequired,

	/** this is called when the save button is clicked */
	handleSave: PropTypes.func.isRequired,
};

export default EditDialog;
