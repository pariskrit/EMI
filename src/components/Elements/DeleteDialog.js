import React, { useEffect, useState } from "react";
import DeleteDialogStyle from "styles/application/DeleteDialogStyle";
import API from "helpers/api";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import LinearProgress from "@material-ui/core/LinearProgress";
import { connect } from "react-redux";
import { showError } from "redux/common/actions";

// Init styled components
const ADD = DeleteDialogStyle();

const DeleteDialog = ({
	entityName,
	open,
	closeHandler,
	deleteEndpoint,
	deleteID,
	handleRemoveData,
	isLogo = false,
	getError,
	pushSomeWhere = false,
}) => {
	// Init state
	const [isUpdating, setIsUpdating] = useState(false);

	// Handlers
	const handleDeleteData = async () => {
		// Attempting to delete data
		try {
			let result = null;

			// Making DELETE to backend
			if (isLogo) {
				result = await API.patch(`${deleteEndpoint}/${deleteID}`, [
					{
						op: "replace",
						path: "logoKey",
						value: null,
					},
				]);
			} else {
				result = await API.delete(`${deleteEndpoint}/${deleteID}`);
			}

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
			if (err?.response?.data?.detail) {
				getError(err.response.data.detail);
			}
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
			if (!pushSomeWhere) {
				closeHandler();
				setIsUpdating(false);
			}
		});
	};

	useEffect(() => {
		return () => setIsUpdating(false);
	}, []);

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

const mapDispatchToProps = (dispatch) => ({
	getError: (msg) => dispatch(showError(msg)),
});

export default connect(null, mapDispatchToProps)(DeleteDialog);
