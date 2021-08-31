import React, { useState } from "react";
import {
	Dialog,
	DialogContent,
	DialogTitle,
	LinearProgress,
	TextField,
	Typography,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { generateErrorState, handleValidateObj } from "helpers/utils";
import AddDialogStyle from "styles/application/AddDialogStyle";
import * as yup from "yup";

const schema = yup.object({
	name: yup
		.string("This field must be a string")
		.required("This field is required"),
	description: yup
		.string("This field must be a string")
		.required("This field is required"),
});

const ADD = AddDialogStyle();
const defaultData = { name: "", description: "" };
const defaultError = { name: null, description: null };

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
	expandIcon: {
		transform: "scale(0.8)",
	},
	inputText: {
		fontSize: 14,
	},
});

const AddAssetDialog = ({ open, handleClose, createHandler }) => {
	const classes = useStyles();
	const [input, setInput] = useState(defaultData);
	const [errors, setErrors] = useState(defaultError);
	const [loading, setLoading] = useState(false);

	const closeOverride = () => {
		handleClose();
		setInput(defaultData);
		setErrors(defaultError);
	};

	const handleCreateData = async () => {
		setLoading(true);
		try {
			const localChecker = await handleValidateObj(schema, input);
			if (!localChecker.some((el) => el.valid === false)) {
				const newData = await createHandler(input);
				if (newData.success) {
					setLoading(false);
					closeOverride();
				} else {
					setErrors({ ...errors, ...newData.errors });
					setLoading(false);
				}
			} else {
				const newErrors = generateErrorState(localChecker);
				setErrors({ ...errors, ...newErrors });
				setLoading(false);
			}
		} catch (err) {
			console.log(err);
			setLoading(false);
			closeOverride();
		}
	};

	const handleEnterPress = (e) => {
		// 13 is the enter keycode
		if (!loading) {
			if (e.keyCode === 13) {
				handleCreateData();
			}
		}
	};

	return (
		<Dialog
			open={open}
			onClose={closeOverride}
			aria-labelledby="alert-dialog-title"
			aria-describedby="alert-dialog-description"
			className="application-dailog"
		>
			{loading ? <LinearProgress /> : null}
			<ADD.ActionContainer>
				<DialogTitle id="alert-dialog-title">
					{<ADD.HeaderText>Add Application</ADD.HeaderText>}
				</DialogTitle>
				<ADD.ButtonContainer>
					<ADD.CancelButton onClick={closeOverride} variant="contained">
						Cancel
					</ADD.CancelButton>
					<ADD.ConfirmButton
						onClick={handleCreateData}
						variant="contained"
						className={classes.createButton}
						disabled={loading}
					>
						Add Asset
					</ADD.ConfirmButton>
				</ADD.ButtonContainer>
			</ADD.ActionContainer>
			<DialogContent className={classes.dialogContent}>
				<Typography className={classes.labelText}>
					Select Application
				</Typography>
				<TextField
					label="Name"
					error={errors.name === null ? false : true}
					helperText={errors.name === null ? null : errors.name}
					fullWidth
					onChange={(e) => setInput({ ...input, name: e.target.value })}
					onKeyDown={handleEnterPress}
				/>
				<TextField
					label="Description"
					error={errors.description === null ? false : true}
					helperText={errors.description === null ? null : errors.description}
					fullWidth
					multiline
					onChange={(e) => setInput({ ...input, description: e.target.value })}
					onKeyDown={handleEnterPress}
				/>
			</DialogContent>
		</Dialog>
	);
};

export default AddAssetDialog;
