import React, { useState } from "react";
import AddDialogStyle from "styles/application/AddDialogStyle";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import LinearProgress from "@material-ui/core/LinearProgress";
import * as yup from "yup";
import { handleValidateObj, generateErrorState } from "helpers/utils";
import TextField from "@material-ui/core/TextField";
import MenuItem from "@material-ui/core/MenuItem";
import { addDefectStatuses } from "services/clients/sites/siteApplications/defectStatuses";
import { defectStatusTypes } from "helpers/constants";

// Init styled components
const ADD = AddDialogStyle();

// Yup validation schema
const schema = yup.object({
	name: yup
		.string("This field must be a string")
		.required("This field is required"),
	type: yup
		.string("This field must be a string")
		.required("This field is required"),
});

// Default state schemas
const defaultErrorSchema = { name: null, type: null };
const defaultStateSchema = { name: "", type: "O" };

const AddDialog = ({
	open,
	closeHandler,
	applicationID,
	handleAddData,
	setError,
	header,
}) => {
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
	const handleAddClick = async () => {
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
	const handleCreateData = async () => {
		const result = await addDefectStatuses({
			siteAppId: applicationID,
			name: input.name,
			type: input.type,
		});

		// Handling success
		if (result.status) {
			// Adding new type to state
			handleAddData({
				id: result.data,
				applicationID: applicationID,
				name: input.name,
				type: defectStatusTypes.find((type) => type.value === input.type)[
					"label"
				],
			});

			return { success: true };
		} else {
			setError(result.data.detail);
			return { success: false };
		}
	};

	const handleEnterPress = (e) => {
		// 13 is the enter keycode
		if (e.keyCode === 13) {
			handleAddClick();
		}
	};

	return (
		<div>
			<Dialog
				fullWidth={true}
				maxWidth="md"
				open={open}
				onClose={closeOverride}
				aria-labelledby="title"
				aria-describedby="description"
			>
				{isUpdating ? <LinearProgress /> : null}

				<ADD.ActionContainer>
					<DialogTitle id="alert-dialog-title">
						{<ADD.HeaderText>Add Defect {header}</ADD.HeaderText>}
					</DialogTitle>
					<ADD.ButtonContainer>
						<ADD.CancelButton onClick={closeOverride} variant="contained">
							Cancel
						</ADD.CancelButton>
						<ADD.ConfirmButton variant="contained" onClick={handleAddClick}>
							Add New
						</ADD.ConfirmButton>
					</ADD.ButtonContainer>
				</ADD.ActionContainer>

				<ADD.DialogContent>
					<div>
						<ADD.InputContainer>
							<ADD.LeftInputContainer>
								<ADD.NameLabel>
									Name<ADD.RequiredStar>*</ADD.RequiredStar>
								</ADD.NameLabel>
								<ADD.NameInput
									error={errors.name === null ? false : true}
									helperText={errors.name === null ? null : errors.name}
									variant="outlined"
									value={input.name}
									autoFocus
									onKeyDown={handleEnterPress}
									onChange={(e) => {
										setInput({ ...input, name: e.target.value });
									}}
								/>
							</ADD.LeftInputContainer>

							<ADD.RightInputContainer>
								<ADD.InputLabel>
									Type<ADD.RequiredStar>*</ADD.RequiredStar>
								</ADD.InputLabel>
								<TextField
									error={errors.type === null ? false : true}
									helperText={errors.type === null ? null : errors.type}
									fullWidth={true}
									select
									value={input.type}
									onChange={(e) => {
										setInput({ ...input, type: e.target.value });
									}}
									variant="outlined"
								>
									{defectStatusTypes.map((type) => (
										<MenuItem key={type.value} value={type.value}>
											{type.label}
										</MenuItem>
									))}
								</TextField>
							</ADD.RightInputContainer>
						</ADD.InputContainer>
					</div>
				</ADD.DialogContent>
			</Dialog>
		</div>
	);
};

export default AddDialog;
