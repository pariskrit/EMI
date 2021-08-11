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
	qty: yup
		.number("This field must be a number")
		.required("This field is required"),
	location: yup
		.string("This field must be a string")
		.required("This field is required"),
});

const ADD = AddDialogStyle();
const defaultData = { name: "", qty: "", location: "" };
const defaultError = { name: null, qty: null, location: null };

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
const AddAppDialog = ({ open, handleClose, createHandler }) => {
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
						Create Application
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
					<Typography className={classes.labelText}>Qty</Typography>
					<TextField
						error={errors.qty === null ? false : true}
						helperText={errors.qty === null ? null : errors.qty}
						fullWidth
						type="number"
						className={classes.textField}
						onChange={(e) => setInput({ ...input, qty: e.target.value })}
					/>
				</div>
				<div>
					<Typography className={classes.labelText}>Location</Typography>
					<TextField
						error={errors.location === null ? false : true}
						helperText={errors.location === null ? null : errors.location}
						fullWidth
						multiline
						onChange={(e) => setInput({ ...input, location: e.target.value })}
					/>
				</div>
			</DialogContent>
		</Dialog>
	);
};

export default AddAppDialog;
