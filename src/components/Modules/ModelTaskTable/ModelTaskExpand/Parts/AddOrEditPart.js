import React, { useEffect, useState } from "react";
import {
	Dialog,
	DialogContent,
	DialogTitle,
	LinearProgress,
} from "@material-ui/core";
import * as yup from "yup";
import { makeStyles } from "@material-ui/core/styles";
import AddDialogStyle from "styles/application/AddDialogStyle";
import { generateErrorState, handleValidateObj } from "helpers/utils";
import { useDispatch } from "react-redux";
import { showError } from "redux/common/actions";

// Init styled components
const ADD = AddDialogStyle();

// Yup validation schema
const schema = yup.object({
	qty: yup.number("This field must be a number"),
	name: yup
		.string("This field must be string")
		.required("Part Number is required"),
	description: yup
		.string()
		.max(100, "must be less than 100 characters")
		.nullable(),
	stockNumber: yup
		.string()
		.max(100, "must be less than 100 characters")
		.nullable(),
});

const useStyles = makeStyles({
	dialogContent: {
		display: "flex",
		flexDirection: "column",
		gap: "12px",
	},
	createButton: {
		width: "auto",
	},
	inputText: {
		fontSize: 14,
	},
});

// Default state schemas
const defaultErrorSchema = {
	name: null,
	qty: null,
	description: null,
	stockNumber: null,
};
const defaultStateSchema = {
	name: "",
	qty: "",
	description: "",
	stockNumber: "",
};

function AddOrEditPart({
	open,
	closeHandler,
	data,
	title,
	createProcessHandler,
	fetchData,
}) {
	// Init hooks
	const classes = useStyles();
	const dispatch = useDispatch();

	// Init state
	const [isUpdating, setIsUpdating] = useState(false);
	const [input, setInput] = useState(defaultStateSchema);
	const [errors, setErrors] = useState(defaultErrorSchema);

	useEffect(() => {
		if (data) {
			setInput(data);
		}
	}, [data]);

	const closeOverride = () => {
		// Clearing input state and errors
		setInput(defaultStateSchema);
		setErrors(defaultErrorSchema);

		closeHandler();
	};

	const handleCreateProcess = async () => {
		// Rendering spinner
		setIsUpdating(true);

		// Clearing errors before attempted create
		setErrors(defaultErrorSchema);

		// cleaned Input

		try {
			const cleanInput = {
				...input,
				description: input.description || null,
				stockNumber: input.stockNumber || null,
				qty: +input.qty || 0,
			};
			const localChecker = await handleValidateObj(schema, cleanInput);

			// Attempting API call if no local validaton errors
			if (!localChecker.some((el) => el.valid === false)) {
				const newData = await createProcessHandler(cleanInput);
				if (newData.status) {
					setIsUpdating(false);
					fetchData();
					closeOverride();
				} else {
					setIsUpdating(false);
					dispatch(
						showError(newData?.data?.detail || "Could not add new part")
					);
				}
			} else {
				// show validation errors
				const newErrors = generateErrorState(localChecker);
				setErrors({ ...errors, ...newErrors });
				setIsUpdating(false);
			}
		} catch (err) {
			// TODO: handle non validation errors here

			setIsUpdating(false);
			setErrors({ ...errors, ...err?.response?.data?.errors });
			dispatch(
				showError(err?.response?.data?.title || "Could not add new part")
			);
		}
	};

	return (
		<div>
			<Dialog
				fullWidth={true}
				maxWidth="md"
				open={open}
				onClose={closeOverride}
				aria-labelledby="alert-dialog-title"
				aria-describedby="alert-dialog-description"
				className="application-dailog"
			>
				{isUpdating ? <LinearProgress /> : null}

				<ADD.ActionContainer>
					<DialogTitle id="alert-dialog-title">
						{<ADD.HeaderText>{title}</ADD.HeaderText>}
					</DialogTitle>
					<ADD.ButtonContainer>
						<div className="modalButton">
							<ADD.CancelButton onClick={closeOverride} variant="contained">
								Cancel
							</ADD.CancelButton>
						</div>
						<div className="modalButton">
							<ADD.ConfirmButton
								onClick={handleCreateProcess}
								variant="contained"
								className={classes.createButton}
								disabled={isUpdating}
							>
								{title}
							</ADD.ConfirmButton>
						</div>
					</ADD.ButtonContainer>
				</ADD.ActionContainer>

				<DialogContent className={classes.dialogContent}>
					<ADD.InputContainer>
						<ADD.LeftInputContainer>
							<ADD.NameLabel>Quantity</ADD.NameLabel>
							<ADD.NameInput
								error={errors.qty === null ? false : true}
								helperText={errors.qty === null ? null : errors.qty}
								value={input.qty}
								onChange={(e) => {
									setInput({ ...input, qty: e.target.value });
								}}
								variant="outlined"
								fullWidth
								type="number"
							/>
						</ADD.LeftInputContainer>

						<ADD.RightInputContainer>
							<ADD.NameLabel>
								Part Number<ADD.RequiredStar>*</ADD.RequiredStar>
							</ADD.NameLabel>
							<ADD.NameInput
								error={errors.name === null ? false : true}
								helperText={errors.name === null ? null : errors.name}
								value={input.name}
								onChange={(e) => {
									setInput({ ...input, name: e.target.value });
								}}
								variant="outlined"
								fullWidth
							/>
						</ADD.RightInputContainer>
					</ADD.InputContainer>
					<ADD.InputContainer>
						<ADD.LeftInputContainer>
							<ADD.NameLabel>Stock Number</ADD.NameLabel>
							<ADD.NameInput
								error={errors.stockNumber === null ? false : true}
								helperText={
									errors.stockNumber === null ? null : errors.stockNumber
								}
								value={input.stockNumber}
								onChange={(e) => {
									setInput({ ...input, stockNumber: e.target.value });
								}}
								variant="outlined"
								fullWidth
							/>
						</ADD.LeftInputContainer>

						<ADD.RightInputContainer>
							<ADD.NameLabel>Description</ADD.NameLabel>
							<ADD.NameInput
								error={errors.description === null ? false : true}
								helperText={
									errors.description === null ? null : errors.description
								}
								value={input.description}
								onChange={(e) => {
									setInput({ ...input, description: e.target.value });
								}}
								variant="outlined"
								fullWidth
							/>
						</ADD.RightInputContainer>
					</ADD.InputContainer>
				</DialogContent>
			</Dialog>
		</div>
	);
}

export default AddOrEditPart;
