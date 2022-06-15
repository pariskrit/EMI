import { Dialog, DialogTitle, LinearProgress } from "@material-ui/core";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { showError } from "redux/common/actions";
import { deleteDefectAudio } from "services/defects/details";
import DeleteDialogStyle from "styles/application/DeleteDialogStyle";

const ADD = DeleteDialogStyle();

function DeleteDialog({ open, closeHandler, entityName, defectId }) {
	const [isUpdating, setIsUpdating] = useState(false);
	const dispatch = useDispatch();

	const handleDeleteConfirm = async () => {
		setIsUpdating(true);
		const response = await deleteDefectAudio(defectId);

		if (!response.status)
			dispatch(showError(response.data?.detail || "Could not delete audio"));

		setIsUpdating(false);
	};
	return (
		<Dialog
			open={open}
			onClose={closeHandler}
			aria-labelledby="delete-title"
			aria-describedby="delete-description"
		>
			{isUpdating ? <LinearProgress /> : null}

			<ADD.ActionContainer>
				<DialogTitle id="delete-dialog-title">
					{<ADD.HeaderText>Delete {entityName}</ADD.HeaderText>}
				</DialogTitle>
				<ADD.ButtonContainer>
					<ADD.CancelButton onClick={closeHandler} variant="contained">
						Cancel
					</ADD.CancelButton>
					<ADD.DeleteButton onClick={handleDeleteConfirm} variant="contained">
						Delete
					</ADD.DeleteButton>
				</ADD.ButtonContainer>
			</ADD.ActionContainer>

			<ADD.DialogContent>
				<ADD.InputContainer id="alert-dialog-description">
					You are about to delete a {entityName}. This cannot be undone.
				</ADD.InputContainer>
			</ADD.DialogContent>
		</Dialog>
	);
}

export default DeleteDialog;
