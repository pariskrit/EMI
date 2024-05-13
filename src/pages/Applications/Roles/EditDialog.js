import React, { useState, useEffect } from "react";
import API from "helpers/api";
import EditDialogStyle from "styles/application/EditDialogStyle";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import LinearProgress from "@mui/material/LinearProgress";
import EMICheckbox from "components/Elements/EMICheckbox";
import * as yup from "yup";
import { handleValidateObj, generateErrorState } from "helpers/utils";
import { useDispatch } from "react-redux";
import { showError } from "redux/common/actions";
import ColourConstants from "helpers/colourConstants";

// Init styled components
const AED = EditDialogStyle();

// Yup validation schema
const schema = yup.object({
	name: yup
		.string("This field must be a string")
		.required("This field is required"),
	defects: yup
		.boolean("This field must be a boolean (true or false)")
		.required("This field is required"),
});

// Default state schemas
const defaultErrorSchema = { name: null, defects: null };
const defaultStateSchema = { name: "", defects: false };

const EditRoleDialog = ({ open, closeHandler, data, handleEditData }) => {
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
		// Attempting to create member
		try {
			const result = await API.patch(`/api/ApplicationRoles/${data.id}`, [
				{
					op: "replace",
					path: "name",
					value: input.name,
				},
				{
					op: "replace",
					path: "canRegisterDefects",
					value: input.defects,
				},
			]);

			// Handling success
			if (result.status === 200) {
				// Adding new member to state
				handleEditData({
					id: data.id,
					applicationID: data.applicationID,
					name: input.name,
					canRegisterDefects: input.defects,
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
			dispatch(showError("Failed to edit role."));

			setIsUpdating(false);
			closeOverride();
		}
	};

	const handleEnterPress = (e) => {
		// 13 is the enter keycode
		if (e.keyCode === 13) {
			handleSave();
		}
	};

	// Updating input state
	useEffect(() => {
		if (data !== null && open) {
			setInput({ name: data.name, defects: data.canRegisterDefects });
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
					<DialogTitle id="edit-dialog-title">
						{<AED.HeaderText>Edit Role</AED.HeaderText>}
					</DialogTitle>
					<AED.ButtonContainer>
						<AED.CancelButton
							onClick={closeOverride}
							variant="contained"
							sx={{
								"&.MuiButton-root:hover": {
									backgroundColor: ColourConstants.deleteDialogHover,
									color: "#ffffff",
								},
							}}
						>
							Cancel
						</AED.CancelButton>
						<AED.ConfirmButton
							variant="contained"
							onClick={handleSave}
							sx={{
								"&.MuiButton-root:hover": {
									backgroundColor: ColourConstants.deleteDialogHover,
									color: "#ffffff",
								},
							}}
						>
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

							<AED.CheckboxContainer>
								<AED.CheckboxLabel>
									<EMICheckbox
										state={input.defects}
										changeHandler={() => {
											setInput({
												...input,
												defects: !input.defects,
											});
										}}
									/>
									Can Role register defects?
								</AED.CheckboxLabel>
							</AED.CheckboxContainer>
						</AED.InputContainer>
					</div>
				</AED.DialogContent>
			</Dialog>
		</div>
	);
};

export default EditRoleDialog;
