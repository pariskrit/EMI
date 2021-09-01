import * as yup from "yup";
import React, { useState } from "react";
import Dialog from "@material-ui/core/Dialog";
import { makeStyles } from "@material-ui/core/styles";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import LinearProgress from "@material-ui/core/LinearProgress";
import AddDialogStyle from "styles/application/AddDialogStyle";
import { handleValidateObj, generateErrorState } from "helpers/utils";
import API from "helpers/api";

// Init styled components
const ADD = AddDialogStyle();

// Yup validation schema
const schema = yup.object({
	name: yup
		.string("This field must be a string")
		.required("This field is required"),
	description: yup
		.string("This field must be a string")
		.required("This field is required"),
});

// Default state schemas
const defaultErrorSchema = { name: null, description: null };
const defaultStateSchema = { name: "", description: "" };

const useStyles = makeStyles({
	dialogContent: {
		width: 500,
		["@media (max-width: 414px)"]: {
			width: "100%",
		},
	},
	createButton: {
		width: "auto",
	},
});

const AddDepartmentDialog = ({ open, closeHandler, createHandler, siteID }) => {
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
		// Adding progress indicator
		setIsUpdating(true);

		try {
			const localChecker = await handleValidateObj(schema, input);

			console.log(localChecker);

			// Attempting API call if no local validaton errors
			if (!localChecker.some((el) => el.valid === false)) {
				// Creating new data
				const newData = await handleCreateData();

				if (newData.success) {
					setIsUpdating(false);
					closeOverride();
				} else {
					setIsUpdating(false);
				}
			} else {
				const newErrors = generateErrorState(localChecker);

				setErrors({ ...errors, ...newErrors });
				setIsUpdating(false);
			}
		} catch (err) {
			// TODO: handle non validation errors here
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

	const handleCreateData = async () => {
		// Attempting to create
		try {
			// Submitting to backend
			const result = await API.post("/api/SiteDepartments", {
				siteId: siteID,
				name: input.name,
				description: input.description,
			});

			// Handling success
			if (result.status === 201) {
				// Adding new type to state
				createHandler({
					id: result.data,
					siteID: siteID,
					name: input.name,
					description: input.description,
				});

				return { success: true };
			} else {
				throw new Error(result);
			}
		} catch (err) {
			if (err.response.data.errors !== undefined) {
				setErrors({ ...errors, ...err.response.data.errors });
			} else {
				// If no explicit errors provided, throws to caller
				throw new Error(err);
			}

			return { success: false };
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
							variant="outlined"
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
							helperText={
								errors.description === null ? null : errors.description
							}
							required
							variant="outlined"
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
