import React, { useState } from "react";
import DuplicateDialogStyle from "styles/application/DuplicateDialogStyle";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import LinearProgress from "@mui/material/LinearProgress";
import * as yup from "yup";
import { handleValidateObj, generateErrorState } from "helpers/utils";
import { showError } from "redux/common/actions";
import { useDispatch } from "react-redux";

// Init styled components
const ADD = DuplicateDialogStyle();

// Yup validation schema
const schema = yup.object({
	name: yup
		.string("This field must be a string")
		.required("This field is required"),
});

// Default state schemas
const defaultErrorSchema = { name: null };
const defaultStateSchema = { name: "" };

const DuplicateApplicationDialog = ({
	id,
	open,
	closeHandler,
	duplicateHandler,
}) => {
	// Init state
	const [isUpdating, setIsUpdating] = useState(false);
	const [input, setInput] = useState(defaultStateSchema);
	const [errors, setErrors] = useState(defaultErrorSchema);
	const dispatch = useDispatch();

	// Handlers
	const closeOverride = () => {
		// Clearing input state and errors
		setInput(defaultStateSchema);
		setErrors(defaultErrorSchema);

		closeHandler();
	};
	const handleCreateProcess = async () => {
		// Rendering spinner
		setIsUpdating(true);

		try {
			const localChecker = await handleValidateObj(schema, input);

			// Attempting API call if no local validaton errors
			if (!localChecker.some((el) => el.valid === false)) {
				// Creating new data
				const newData = await duplicateHandler(id, input);

				if (newData.success) {
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
			// TODO: handle non validation errors here
			dispatch(showError(`Failed to duplicate application.`));

			setIsUpdating(false);
			closeOverride();
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

				<div className="duplicateTitle">
					<DialogTitle id="alert-dialog-title">
						{<ADD.HeaderText>Duplicate Application</ADD.HeaderText>}
					</DialogTitle>
					<ADD.ButtonContainer>
						<ADD.CancelButton
							onClick={closeOverride}
							variant="contained"
							
						>
							Cancel
						</ADD.CancelButton>
						<ADD.ConfirmButton
							onClick={handleCreateProcess}
							variant="contained"
						>
							Duplicate
						</ADD.ConfirmButton>
					</ADD.ButtonContainer>
				</div>

				<DialogContent className="duplicateDialogContent">
					<div className="duplicateInputContainer">
						<ADD.NameInput
							error={errors.name === null ? false : true}
							helperText={errors.name === null ? null : errors.name}
							required
							label="Application Name"
							value={input.name}
							onChange={(e) => {
								setInput({ ...input, name: e.target.value });
							}}
							onKeyDown={(e) => {
								if (e.keyCode === 13) {
									handleCreateProcess();
								}
							}}
						/>
					</div>
				</DialogContent>
			</Dialog>
		</div>
	);
};

export default DuplicateApplicationDialog;
