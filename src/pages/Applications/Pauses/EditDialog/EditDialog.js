import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import API from "helpers/api";
import EditDialogStyle from "styles/application/EditDialogStyle";
import PauseDialogStyle from "styles/application/PauseDialogStyle";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import LinearProgress from "@material-ui/core/LinearProgress";
import Subcat from "./Subcat";
import NewSubcat from "./NewSubcat";
import ErrorAlert from "../ErrorAlert";
import * as yup from "yup";
import { handleValidateObj, generateErrorState } from "helpers/utils";
import DeleteDialog from "components/Elements/DeleteDialog";

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
const defaultDelete = { delete: false, sub: {} };

const EditPauseDialog = ({
	open,
	closeHandler,
	editData,
	handleRemoveSubcat,
	handleAddSubcat,
	handleEditData,
	handleUpdateSubcatStateName,
}) => {
	// Init hooks
	const classes = useStyles();

	// Init state
	const [isUpdating, setIsUpdating] = useState(false);
	const [isAddNew, setIsAddNew] = useState(false);
	const [input, setInput] = useState(defaultStateSchema);
	const [errors, setErrors] = useState(defaultErrorSchema);
	const [deleteInfo, setDeleteInfo] = useState(defaultDelete);

	// Handlers
	const closeOverride = () => {
		// Closing dialog
		closeHandler();
		// Removing new subcat input
		setIsAddNew(false);
	};
	const handleUpdateData = async (d) => {
		try {
			// Attempting to update pause
			let result = await API.patch(`/api/ApplicationPauses/${editData.id}`, [
				{
					op: "replace",
					path: "name",
					value: d.name,
				},
			]);

			// if success, adding data to reducer
			if (result.status === 200) {
				// Updating state
				handleEditData({
					id: editData.id,
					name: input.name,
					pauseSubcategories: editData.pauseSubcategories,
				});

				return { success: true };
			} else {
				// If error, throwing to catch
				throw new Error(result);
			}
		} catch (err) {
			if (
				err.response.data.detail !== null ||
				err.response.data.detail !== undefined
			) {
				setErrors({ ...errors, ...{ alert: err.response.data.detail } });
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
			<DeleteDialog
				entityName="Pause Content"
				open={deleteInfo.delete}
				closeHandler={() => setDeleteInfo(defaultDelete)}
				deleteID={deleteInfo.sub.id}
				deleteEndpoint="/api/ApplicationPauseSubcategories"
				handleRemoveData={() => handleRemoveSubcat(deleteInfo.sub)}
			/>
			<Dialog
				classes={{ paper: classes.paper }}
				open={open}
				onClose={closeOverride}
				aria-labelledby="alert-dialog-title"
				aria-describedby="alert-dialog-description"
			>
				{isUpdating ? <LinearProgress /> : null}

				{/* Alert Render*/}
				{errors.alert === null ? null : (
					<ErrorAlert errorMessage={errors.alert} />
				)}

				<AED.ActionContainer>
					<DialogTitle id="alert-dialog-title">
						<AED.HeaderText>Edit Pause Reason</AED.HeaderText>
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

								<AED.InfoText>Add additional Pause reasons</AED.InfoText>
							</APD.SecondaryHeaderContainer>
						</AED.InputContainer>

						{/* Field to add new subcat */}
						{isAddNew ? (
							<NewSubcat
								editData={editData}
								setIsUpdating={setIsUpdating}
								handleAddSubcat={handleAddSubcat}
								setIsAddNew={setIsAddNew}
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
											handleDelete={() => setDeleteInfo({ sub, delete: true })}
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
