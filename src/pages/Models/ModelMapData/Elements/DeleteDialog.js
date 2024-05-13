import React from "react";
import { Dialog, DialogTitle, LinearProgress } from "@mui/material";
import DeleteDialogStyle from "styles/application/DeleteDialogStyle";

const ADD = DeleteDialogStyle();

const DeleteDialog = ({
	confirmDelete,
	closeHandler,
	handleDeleteConfirm,
	isUpdating,
}) => {
	return (
		<Dialog
			open={confirmDelete}
			onClose={closeHandler}
			aria-labelledby="delete-title"
			aria-describedby="delete-description"
		>
			{isUpdating ? <LinearProgress /> : null}

			<ADD.ActionContainer>
				<DialogTitle id="delete-dialog-title">
					{<ADD.HeaderText>Are You Sure ?</ADD.HeaderText>}
				</DialogTitle>
				<ADD.ButtonContainer>
					<ADD.CancelButton onClick={closeHandler} variant="contained">
						Cancel
					</ADD.CancelButton>
					<ADD.DeleteButton
						onClick={() => handleDeleteConfirm(null)}
						variant="contained"
					>
						Delete
					</ADD.DeleteButton>
				</ADD.ButtonContainer>
			</ADD.ActionContainer>
		</Dialog>
	);
};

export default DeleteDialog;
