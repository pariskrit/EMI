import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import EditDialogStyle from "styles/application/EditDialogStyle";
import PauseDialogStyle from "styles/application/PauseDialogStyle";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import LinearProgress from "@material-ui/core/LinearProgress";
import Subcat from "./Subcat";
import NewSubcat from "./NewSubcat";
import * as yup from "yup";
import { handleValidateObj, generateErrorState } from "helpers/utils";
import { updatePauses } from "services/clients/sites/siteApplications/pauses";

// Init styled components
const AED = EditDialogStyle();
const APD = PauseDialogStyle();

// Yup validation schema
const schema = yup.object({
	name: yup
		.string("This field must be a string")
		.required("This field is required"),
});

// Default state schemas
const defaultErrorSchema = { name: null, alert: null };
const defaultStateSchema = { name: "" };

const useStyles = makeStyles({
	// Override for paper used in dialog
	paper: { minWidth: "90%" },
});

const EditPauseDialog = ({
	open,
	closeHandler,
	editData,
	handleRemoveSubcat,
	handleAddSubcat,
	handleEditData,
	handleUpdateSubcatStateName,
	getError,
	header,
}) => {
	// Init hooks
	const classes = useStyles();

	// Init state
	const [isUpdating, setIsUpdating] = useState(false);
	const [isAddNew, setIsAddNew] = useState(false);
	const [input, setInput] = useState(defaultStateSchema);
	const [errors, setErrors] = useState(defaultErrorSchema);

	// Handlers
	const closeOverride = () => {
		// Closing dialog
		closeHandler();
		// Removing new subcat input
		setIsAddNew(false);
		setErrors(defaultErrorSchema);
	};
	const handleUpdateData = async (d) => {
		try {
			// Attempting to update pause
			let result = await updatePauses(editData.id, [
				{
					op: "replace",
					path: "name",
					value: d.name,
				},
			]);

			// if success, adding data to reducer
			if (result.status) {
				// Updating state
				handleEditData({
					id: editData.id,
					name: input.name,
					pauseSubcategories: editData.pauseSubcategories,
				});

				return { success: true };
			} else {
				// If error, throwing to catch
				if (result.data.detail) {
					// setErrors({ ...errors, ...{ alert: result.data.detail } });
					getError(result.data.detail);
				} else {
					// If no explicit errors provided, throws to caller
					throw new Error(result);
				}

				return { success: false };
			}
		} catch (err) {
			console.log(err);
		}
	};
	const handleSave = async () => {
		// Adding progress indicator
		setIsUpdating(true);

		// Cleaning any existing errors
		setErrors(defaultErrorSchema);

		try {
			const localChecker = await handleValidateObj(schema, input);

			// Attempting API call if no local validaton errors
			if (!localChecker.some((el) => el.valid === false)) {
				const updatedData = await handleUpdateData({
					id: editData.id,
					name: input.name,
				});

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

	const handleAddNewClick = () => {
		setIsAddNew(true);
	};
	const handleEnterPress = (e) => {
		// 13 is the enter keycode
		if (e.keyCode === 13) {
			handleSave();
		}
	};

	// Updating name when data passed to component
	useEffect(() => {
		if (editData !== null && open) {
			setInput({ ...input, ...{ name: editData.name } });
		}
		// eslint-disable-next-line
	}, [editData, open]);

	return (
		<div>
			<Dialog
				classes={{ paper: classes.paper }}
				open={open}
				onClose={closeOverride}
				aria-labelledby="alert-dialog-title"
				aria-describedby="alert-dialog-description"
			>
				{isUpdating ? <LinearProgress /> : null}

				{/* Alert Render*/}

				<AED.ActionContainer>
					<DialogTitle id="alert-dialog-title">
						<AED.HeaderText>Edit {header}</AED.HeaderText>
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
							<APD.NameInputContainer>
								<AED.NameLabel>
									Name<AED.RequiredStar>*</AED.RequiredStar>
								</AED.NameLabel>
								<AED.NameInput
									error={errors.name === null ? false : true}
									helperText={errors.name === null ? null : errors.name}
									variant="outlined"
									size="small"
									value={input.name}
									autoFocus
									onKeyDown={handleEnterPress}
									onChange={(e) => {
										setInput({ ...input, ...{ name: e.target.value } });
									}}
								/>
							</APD.NameInputContainer>
						</AED.InputContainer>

						<APD.DividerGutter />

						<AED.InputContainer>
							<APD.SecondaryHeaderContainer>
								<AED.HeaderText>
									Sub-categories (
									{editData === null
										? null
										: editData.pauseSubcategories.length}
									)
								</AED.HeaderText>

								<AED.InfoText>Add additional {header}</AED.InfoText>
							</APD.SecondaryHeaderContainer>
						</AED.InputContainer>

						{/* Field to add new subcat */}
						{isAddNew ? (
							<NewSubcat
								editData={editData}
								setIsUpdating={setIsUpdating}
								handleAddSubcat={handleAddSubcat}
								setIsAddNew={setIsAddNew}
								getError={getError}
							/>
						) : null}

						{/* Map to render existing subcats */}
						{editData === null
							? null
							: editData.pauseSubcategories.map((sub, index) => {
									return (
										<Subcat
											key={`${sub.name}${index}`}
											setIsUpdating={setIsUpdating}
											sub={sub}
											handleRemoveSubcat={handleRemoveSubcat}
											handleUpdateSubcatStateName={handleUpdateSubcatStateName}
											getError={getError}
										/>
									);
							  })}

						<APD.NewButtonContainer>
							<APD.NewButton variant="contained" onClick={handleAddNewClick}>
								Add new
							</APD.NewButton>
						</APD.NewButtonContainer>
					</div>
				</AED.DialogContent>
			</Dialog>
		</div>
	);
};

export default EditPauseDialog;
