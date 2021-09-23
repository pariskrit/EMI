import React, { useState, useEffect } from "react";
import EditDialogStyle from "styles/application/EditDialogStyle";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import LinearProgress from "@material-ui/core/LinearProgress";
import * as yup from "yup";
import { handleValidateObj, generateErrorState } from "helpers/utils";
import { updateOperatingModes } from "services/clients/sites/siteApplications/operatingModes";
import { useParams } from "react-router";
import { connect } from "react-redux";
import { showError } from "redux/common/actions";

// Init styled components
const AED = EditDialogStyle();

// Yup validation schema
const schema = yup.object({
	name: yup
		.string("This field must be a string")
		.required("This field is required"),
});

// Default state schemas
const defaultErrorSchema = { name: null };
const defaultStateSchema = { name: "" };

const EditDialog = ({ open, closeHandler, data, handleEditData, setError }) => {
	// Init state
	const [isUpdating, setIsUpdating] = useState(false);
	const [input, setInput] = useState(defaultStateSchema);
	const [errors, setErrors] = useState(defaultErrorSchema);
	const { appId } = useParams();

	// Handlers
	const closeOverride = () => {
		// Updating local state and clearing errors
		setErrors(defaultErrorSchema);

		closeHandler();
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
	const handleUpdateData = async () => {
		const result = await updateOperatingModes(data.id, [
			{
				op: "replace",
				path: "name",
				value: input.name,
			},
		]);
		// Handling success
		if (result.status) {
			// Updating state to match DB
			handleEditData({
				id: data.id,
				name: input.name,
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
			handleSave();
		}
	};

	// Updating name after SC set
	useEffect(() => {
		if (data !== null && open) {
			setInput({ name: data.name });
		}
	}, [data, open]);

	return (
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
					{<AED.HeaderText>Edit Action</AED.HeaderText>}
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
						<AED.NameInputContainer>
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
						</AED.NameInputContainer>
					</AED.InputContainer>
				</div>
			</AED.DialogContent>
		</Dialog>
	);
};

const mapDispatchToProps = (dispatch) => ({
	setError: (message) => dispatch(showError(message)),
});

export default connect(null, mapDispatchToProps)(EditDialog);
