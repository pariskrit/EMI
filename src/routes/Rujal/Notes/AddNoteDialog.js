import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
	Dialog,
	DialogTitle,
	DialogContent,
	TextField,
	LinearProgress,
} from "@material-ui/core";
import * as yup from "yup";
import AddDialogStyle from "../../../styles/application/AddDialogStyle";
import { handleValidateObj, generateErrorState } from "../../../helpers/utils";

const schema = yup.object({
	note: yup
		.string("This field must be a string")
		.required("This field is required"),
});

const ADD = AddDialogStyle();
const defaultData = { note: "" };
const defaultError = { note: null };

const useStyles = makeStyles({
	dialogContent: {
		display: "flex",
		flexDirection: "column",
	},
	createButton: {
		width: "auto",
	},
});

const AddNoteDialog = ({ open, handleClose, createHandler }) => {
	const classes = useStyles();
	const [input, setInput] = useState(defaultData);
	const [errors, setErrors] = useState(defaultError);
	const [isUpdating, setIsUpdating] = useState(false);

	const closeOverride = () => {
		setInput(defaultData);
		setErrors(defaultError);

		handleClose();
	};

	const handleCreateProcess = async () => {
		setIsUpdating(true);

		try {
			const localChecker = await handleValidateObj(schema, input);
			if (!localChecker.some((el) => el.valid === false)) {
				const newData = await createHandler(input.note);
				if (newData.success) {
					setIsUpdating(false);
					closeOverride();
				} else {
					console.log(newData);
					setErrors({ ...errors, ...newData.errors });
					setIsUpdating(false);
				}
			} else {
				const newErrors = generateErrorState(localChecker);
				setErrors({ ...errors, ...newErrors });
				setIsUpdating(false);
			}
		} catch (err) {
			console.log(err);

			setIsUpdating(false);
			closeOverride();
		}
	};

	const handleEnterPress = (e) => {
		// 13 is the enter keycode
		if (e.keyCode === 13) {
			handleCreateProcess();
		}
	};

	return (
		<Dialog
			open={open}
			onClose={closeOverride}
			aria-labelledby="alert-dialog-title"
			aria-describedby="alert-dialog-description"
		>
			{isUpdating ? <LinearProgress /> : null}
			<ADD.ActionContainer>
				<DialogTitle id="alert-dialog-title">
					{<ADD.HeaderText>Add Note</ADD.HeaderText>}
				</DialogTitle>
				<ADD.ButtonContainer>
					<ADD.CancelButton onClick={handleClose} variant="contained">
						Cancel
					</ADD.CancelButton>
					<ADD.ConfirmButton
						onClick={handleCreateProcess}
						variant="contained"
						className={classes.createButton}
					>
						Add Note
					</ADD.ConfirmButton>
				</ADD.ButtonContainer>
			</ADD.ActionContainer>
			<DialogContent className={classes.dialogContent}>
				<TextField
					label="Note"
					error={errors.note === null ? false : true}
					helperText={errors.note === null ? null : errors.note}
					fullWidth
					multiline
					onChange={(e) => setInput({ note: e.target.value })}
					onKeyDown={handleEnterPress}
				/>
			</DialogContent>
		</Dialog>
	);
};

export default AddNoteDialog;
