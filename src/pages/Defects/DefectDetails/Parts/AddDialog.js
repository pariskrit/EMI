import {
	Dialog,
	DialogContent,
	DialogTitle,
	LinearProgress,
	TextField,
} from "@mui/material";
import { makeStyles } from "tss-react/mui";
import { createTheme, ThemeProvider } from "@mui/styles";

import { generateErrorState, handleValidateObj } from "helpers/utils";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { showError } from "redux/common/actions";
import AddDialogStyle from "styles/application/AddDialogStyle";
import * as yup from "yup";

const schema = yup.object({
	quantity: yup
		.number()
		.typeError("Must be greator than 0")
		.min(1, "Must be greator than 0")
		.required("This field is required"),
	name: yup
		.string("This field must be a string")
		.required("This field is required"),
	description: yup.string().nullable(),
});

const ADD = AddDialogStyle();
const defaultData = { quantity: 0, name: "", description: "" };
const defaultError = { quantity: null, name: null, description: null };

const useStyles = makeStyles()((theme) => ({
	dialogContent: {
		display: "flex",
		flexDirection: "column",
	},
	createButton: {
		width: "auto",
	},
}));

const AddNoteDialog = ({ open, handleClose, createHandler, captions }) => {
	const { classes, cx } = useStyles();
	const [input, setInput] = useState(defaultData);
	const [errors, setErrors] = useState(defaultError);
	const [isUpdating, setIsUpdating] = useState(false);
	const dispatch = useDispatch();

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
				await createHandler(input);

				closeOverride();
			} else {
				const newErrors = generateErrorState(localChecker);
				setErrors({ ...errors, ...newErrors });
			}

			setIsUpdating(false);
		} catch (err) {
			setIsUpdating(false);
			dispatch(showError("Failed to add new " + captions?.part));
			closeOverride();
		}
	};

	const handleEnterPress = (e) => {
		// 13 is the enter keycode
		if (!isUpdating) {
			if (e.keyCode === 13) {
				handleCreateProcess();
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
					{<ADD.HeaderText>Add {captions?.part}</ADD.HeaderText>}
				</DialogTitle>
				<ADD.ButtonContainer>
					<ADD.CancelButton
						onClick={closeOverride}
						variant="contained"
						style={{ width: "auto" }}
					>
						Cancel
					</ADD.CancelButton>
					<ADD.ConfirmButton
						onClick={handleCreateProcess}
						variant="contained"
						className={classes.createButton}
						disabled={isUpdating}
					>
						Add {captions?.part}
					</ADD.ConfirmButton>
				</ADD.ButtonContainer>
			</ADD.ActionContainer>
			<DialogContent className={classes.dialogContent}>
				<div style={{ marginBottom: "10px" }}>
					<TextField
						sx={{
							"& .MuiInputBase-input.Mui-disabled": {
								WebkitTextFillColor: "#000000",
							},
						}}
						label="Quantity"
						error={errors.quantity === null ? false : true}
						helperText={errors.quantity === null ? null : errors.quantity}
						fullWidth
						onChange={(e) => setInput({ ...input, quantity: e.target.value })}
						onKeyDown={handleEnterPress}
						type="number"
						autoFocus
					/>
				</div>
				<div style={{ marginBottom: "10px" }}>
					<TextField
						sx={{
							"& .MuiInputBase-input.Mui-disabled": {
								WebkitTextFillColor: "#000000",
							},
						}}
						label="Name"
						error={errors.name === null ? false : true}
						helperText={errors.name === null ? null : errors.name}
						fullWidth
						onChange={(e) => setInput({ ...input, name: e.target.value })}
						onKeyDown={handleEnterPress}
					/>
				</div>

				<div style={{ marginBottom: "10px" }}>
					<TextField
						sx={{
							"& .MuiInputBase-input.Mui-disabled": {
								WebkitTextFillColor: "#000000",
							},
						}}
						label="Description"
						fullWidth
						onChange={(e) =>
							setInput({ ...input, description: e.target.value })
						}
						onKeyDown={handleEnterPress}
					/>
				</div>
			</DialogContent>
		</Dialog>
	);
};

export default AddNoteDialog;
