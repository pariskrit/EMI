import * as yup from "yup";
import Dialog from "@mui/material/Dialog";
import React, { useState, useEffect } from "react";
import DialogTitle from "@mui/material/DialogTitle";
import LinearProgress from "@mui/material/LinearProgress";
import EditDialogStyle from "styles/application/EditDialogStyle";
import { handleValidateObj, generateErrorState } from "helpers/utils";
import { patchDefectRiskRatings } from "services/clients/sites/siteApplications/defectRiskRatings";
import { showError } from "redux/common/actions";
import { useDispatch } from "react-redux";

// Init styled components
const AED = EditDialogStyle();

// Yup validation schema
const schema = yup.object().shape({
	name: yup
		.string("This field must be a string")
		.required("This field is required"),
	action: yup.string("This field must be a string"),
});

// Default state schemas
const defaultErrorSchema = { name: null, action: null };
const defaultStateSchema = { name: "", action: "" };

const EditStopDialog = ({
	open,
	closeHandler,
	data,
	handleEditData,
	getError,
	header,
}) => {
	// Init state
	const [isUpdating, setIsUpdating] = useState(false);
	const [input, setInput] = useState(defaultStateSchema);
	const [errors, setErrors] = useState(defaultErrorSchema);
	const dispatch = useDispatch();

	// Handlers
	const closeOverride = () => {
		setErrors(defaultErrorSchema);

		closeHandler();
	};
	const handleUpdateData = async () => {
		// Attempting to update data
		try {
			let result = await patchDefectRiskRatings(data.id, [
				{
					op: "replace",
					path: "name",
					value: input.name,
				},
				{
					op: "replace",
					path: "action",
					value: input.action,
				},
			]);

			// if success, adding data to reducer
			if (result.status) {
				// Updating state
				handleEditData({
					id: data.id,
					name: input.name,
					action: input.action,
				});

				return { success: true };
			} else {
				if (result.data.detail) {
					getError(result.data.detail);
					return {
						success: false,
						errors: {
							name: null,
						},
					};
				} else {
					return { success: false, errors: { ...result.data.errors } };
				}
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
	const handleSave = async () => {
		// Adding progress indicator
		setIsUpdating(true);

		try {
			const localChecker = await handleValidateObj(schema, input);

			// Attempting API call if no local validaton errors
			if (!localChecker.some((el) => el.valid === false)) {
				// Updating data
				const updatedData = await handleUpdateData();

				if (updatedData.success) {
					setIsUpdating(false);
					closeOverride();
				} else {
					setErrors({ ...errors, ...updatedData.errors });
					setIsUpdating(false);
				}
			} else {
				const newErrors = generateErrorState(localChecker);

				setErrors({ ...errors, ...newErrors });
				setIsUpdating(false);
			}
		} catch (err) {
			// TODO: handle non validation errors here
			setIsUpdating(false);
			closeOverride();
			dispatch(showError(`Failed to edit ${header}.`));
		}
	};

	const handleEnterPress = (e) => {
		// 13 is the enter keycode
		if (e.keyCode === 13) {
			handleSave();
		}
	};

	// Updating name after data set
	useEffect(() => {
		if (data !== null && open) {
			setInput({ name: data.name, action: data.action });
		}
	}, [data, open]);

	return (
		<div>
			<Dialog
				fullWidth={true}
				maxWidth="md"
				open={open}
				onClose={closeOverride}
				aria-labelledby="edit-title"
				aria-describedby="edit-description"
			>
				{isUpdating ? <LinearProgress /> : null}

				<AED.ActionContainer>
					<DialogTitle id="alert-dialog-title">
						{<AED.HeaderText>Edit {header}</AED.HeaderText>}
					</DialogTitle>
					<AED.ButtonContainer>
						<AED.CancelButton onClick={closeOverride} variant="contained">
							Cancel
						</AED.CancelButton>
						<AED.ConfirmButton variant="contained" onClick={handleSave}>
							Save
						</AED.ConfirmButton>
					</AED.ButtonContainer>
				</AED.ActionContainer>

				<AED.DialogContent>
					<div>
						<AED.InputContainer>
							<AED.LeftInputContainer>
								<AED.NameLabel>
									Name<AED.RequiredStar>*</AED.RequiredStar>
								</AED.NameLabel>
								<AED.NameInput
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
							</AED.LeftInputContainer>
							<AED.RightInputContainer>
								<AED.NameLabel>Action</AED.NameLabel>
								<AED.NameInput
									error={errors.action === null ? false : true}
									helperText={errors.action === null ? null : errors.action}
									variant="outlined"
									value={input.action}
									onKeyDown={handleEnterPress}
									onChange={(e) => {
										setInput({ ...input, action: e.target.value });
									}}
								/>
							</AED.RightInputContainer>
						</AED.InputContainer>
					</div>
				</AED.DialogContent>
			</Dialog>
		</div>
	);
};

export default EditStopDialog;
