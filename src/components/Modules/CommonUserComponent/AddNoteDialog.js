import {
	Dialog,
	DialogContent,
	DialogTitle,
	LinearProgress,
	TextField,
} from "@mui/material";
import { makeStyles } from "tss-react/mui";
import { generateErrorState, handleValidateObj } from "helpers/utils";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { showError } from "redux/common/actions";
import AddDialogStyle from "styles/application/AddDialogStyle";
import * as yup from "yup";
import ColourConstants from "helpers/colourConstants";

const schema = yup.object({
	note: yup
		.string("This field must be a string")
		.required("This field is required"),
});

const ADD = AddDialogStyle();
const defaultData = { note: "" };
const defaultError = { note: null };

const useStyles = makeStyles()((theme) => ({
	dialogContent: {
		display: "flex",
		flexDirection: "column",
	},
	createButton: {
		width: "auto",
	},
}));

const AddNoteDialog = ({ open, handleClose, createHandler }) => {
	const dispatch = useDispatch();
	const { classes, cx } = useStyles();
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
				if (newData?.success) {
					setIsUpdating(false);
					closeOverride();
				} else {
					setErrors({ ...errors, ...newData.errors });
					setIsUpdating(false);
				}
			} else {
				const newErrors = generateErrorState(localChecker);
				setErrors({ ...errors, ...newErrors });
				setIsUpdating(false);
			}
		} catch (err) {
			dispatch(showError("Failed to add note."));
			setIsUpdating(false);
			closeOverride();
		}
	};

	const handleEnterPress = async (e) => {
		// 13 is the enter keycode
		if (!isUpdating) {
			if (e.keyCode === 13) {
				await handleCreateProcess();
			}
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
					<ADD.CancelButton
						onClick={handleClose}
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
						onClick={handleCreateProcess}
						variant="contained"
						className={classes.createButton}
						disabled={isUpdating}
						sx={{
							"&.MuiButton-root:hover": {
								backgroundColor: ColourConstants.deleteDialogHover,
								color: "#ffffff",
							},
						}}
					>
						Add Note
					</ADD.ConfirmButton>
				</ADD.ButtonContainer>
			</ADD.ActionContainer>
			<DialogContent className={classes.dialogContent}>
				<TextField
					sx={{
						"& .MuiInputBase-input.Mui-disabled": {
							WebkitTextFillColor: "#000000",
						},
					}}
					variant="standard"
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
