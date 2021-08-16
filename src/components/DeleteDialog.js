import React, { useState } from "react";
import DeleteDialogStyle from "../styles/application/DeleteDialogStyle";
import API from "../helpers/api";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import LinearProgress from "@material-ui/core/LinearProgress";

// Init styled components
const ADD = DeleteDialogStyle();

const DeleteDialog = ({
	entityName,
	open,
	closeHandler,
	deleteEndpoint,
	deleteID,
	handleRemoveData,
}) => {
	// Init state
	const [isUpdating, setIsUpdating] = useState(false);

	// Handlers
	const handleDeleteData = async () => {
		// Attempting to delete data
		try {
			// Making DELETE to backend
			const result = await API.delete(`${deleteEndpoint}/${deleteID}`);

			// Handling success
			if (result.status === 200) {
				// Updating state to match DB
				handleRemoveData(deleteID);

				return true;
			} else {
				// Throwing error if not 200
				throw new Error(result);
			}
		} catch (err) {
			// TODO: real error handling
			console.log(err);

			return false;
		}
	};
	const handleDeleteConfirm = () => {
		// Setting progress indicator
		setIsUpdating(true);

		// Deleting status change
		handleDeleteData().then(() => {
			// Once deleted, closing dialog and updating state
			closeHandler();
			setIsUpdating(false);
		});
	};

	return (
		<div>
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
		</div>
	);
};

export default DeleteDialog;
