import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
	Dialog,
	DialogTitle,
	DialogContent,
	TextField,
	Typography,
} from "@material-ui/core";
import * as yup from "yup";
import AddDialogStyle from "../../../styles/application/AddDialogStyle";
import { handleValidateObj, generateErrorState } from "../../../helpers/utils";

const schema = yup.object({
	name: yup
		.string("This field must be a string")
		.required("This field is required"),
	date: yup
		.string("This field must be a string")
		.required("This field is required"),
	note: yup
		.string("This field must be a string")
		.required("This field is required"),
});

const ADD = AddDialogStyle();
const defaultData = { name: "", date: "", note: "" };
const defaultError = { name: null, date: null, note: null };
const useStyles = makeStyles({
	dialogContent: {
		display: "flex",
		flexDirection: "column",
	},
	createButton: {
		width: "auto",
	},
	labelText: {
		fontFamily: "Roboto Condensed",
		fontWeight: "bold",
		fontSize: "14px",
	},
});
const AddNoteDialog = ({ open, handleClose, createHandler }) => {
	const classes = useStyles();
	const [input, setInput] = useState(defaultData);
	const [errors, setErrors] = useState(defaultError);

	const closeOverride = () => {
		setInput(defaultData);
		setErrors(defaultError);

		handleClose();
	};

	const handleCreateData = async () => {
		const localChecker = await handleValidateObj(schema, input);
		if (!localChecker.some((el) => el.valid === false)) {
		} else {
			const newErrors = generateErrorState(localChecker);

			setErrors({ ...errors, ...newErrors });
		}
	};

	return (
		<Dialog
			open={open}
			onClose={closeOverride}
			aria-labelledby="alert-dialog-title"
			aria-describedby="alert-dialog-description"
		>
			<ADD.ActionContainer>
				<DialogTitle id="alert-dialog-title">
					{<ADD.HeaderText>Add Note</ADD.HeaderText>}
				</DialogTitle>
				<ADD.ButtonContainer>
					<ADD.CancelButton onClick={handleClose} variant="contained">
						Cancel
					</ADD.CancelButton>
					<ADD.ConfirmButton
						onClick={handleCreateData}
						variant="contained"
						className={classes.createButton}
					>
						Add Note
					</ADD.ConfirmButton>
				</ADD.ButtonContainer>
			</ADD.ActionContainer>
			<DialogContent className={classes.dialogContent}>
				<div>
					<Typography className={classes.labelText}>Name</Typography>
					<TextField
						error={errors.name === null ? false : true}
						helperText={errors.name === null ? null : errors.name}
						fullWidth
						onChange={(e) => setInput({ ...input, name: e.target.value })}
					/>
				</div>
				<div>
					<Typography className={classes.labelText}>Date</Typography>
					<TextField
						error={errors.date === null ? false : true}
						helperText={errors.date === null ? null : errors.date}
						id="date"
						fullWidth
						type="date"
						defaultValue="2019-11-11"
						className={classes.textField}
						InputLabelProps={{
							shrink: true,
						}}
						onChange={(e) => setInput({ ...input, date: e.target.value })}
					/>
				</div>
				<div>
					<Typography className={classes.labelText}>Note</Typography>
					<TextField
						error={errors.note === null ? false : true}
						helperText={errors.note === null ? null : errors.note}
						fullWidth
						multiline
						onChange={(e) => setInput({ ...input, note: e.target.value })}
					/>
				</div>
			</DialogContent>
		</Dialog>
	);
};

export default AddNoteDialog;
