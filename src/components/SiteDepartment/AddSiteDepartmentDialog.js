import * as yup from "yup";
import React, { useState } from "react";
import Dialog from "@material-ui/core/Dialog";
import { makeStyles } from "@material-ui/core/styles";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import LinearProgress from "@material-ui/core/LinearProgress";
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
const defaultErrorSchema = { name: null, description: null };
const defaultStateSchema = { name: "", description: '' };

const useStyles = makeStyles({
	dialogContent: {
		width: 500,
	},
	createButton: {
		width: "auto",
	},
});

const AddDepartmentDialog = ({ open, closeHandler, createHandler }) => {
	// Init hooks
	const classes = useStyles();

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
	const handleCreateProcess = async () => {
		createHandler()
	};
	const handleEnterPress = (e) => {
		// 13 is the enter keycode
		if (e.keyCode === 13) {
			handleCreateProcess();
		}
	};

	return (
		<div>
			<Dialog
				open={open}
				onClose={closeOverride}
				aria-labelledby="alert-dialog-title"
				aria-describedby="alert-dialog-description"
			>
				{isUpdating ? <LinearProgress /> : null}

				<ADD.ActionContainer>
					<DialogTitle id="alert-dialog-title">
						{<ADD.HeaderText>Add Department</ADD.HeaderText>}
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
							Create Department
						</ADD.ConfirmButton>
					</ADD.ButtonContainer>
				</ADD.ActionContainer>

				<DialogContent className={classes.dialogContent}>
					<ADD.InputContainer>
						<ADD.NameInput
							error={errors.name === null ? false : true}
							helperText={errors.name === null ? null : errors.name}
							required
							label="Department Name"
							value={input.name}
							onKeyDown={handleEnterPress}
							onChange={(e) => {
								setInput({ ...input, name: e.target.value });
							}}
						/>
					</ADD.InputContainer>
					<ADD.InputContainer>
						<ADD.NameInput
							error={errors.description === null ? false : true}
							helperText={errors.description === null ? null : errors.description}
							required
							label="Department Description"
							value={input.description}
							onKeyDown={handleEnterPress}
							onChange={(e) => {
								setInput({ ...input, description: e.target.value });
							}}
						/>
					</ADD.InputContainer>
				</DialogContent>
			</Dialog>
		</div>
	);
};

export default AddDepartmentDialog;
