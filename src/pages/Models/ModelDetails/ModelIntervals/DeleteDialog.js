import React from "react";
import DeleteDialogStyle from "styles/application/DeleteDialogStyle";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import LinearProgress from "@mui/material/LinearProgress";
import { connect } from "react-redux";
import { showError } from "redux/common/actions";

// Init styled components
const ADD = DeleteDialogStyle();

const DeleteDialog = ({
	entityName,
	open,
	closeHandler,
	isDeleting,
	handleDelete,
}) => {
	return (
		<div>
			<Dialog
				open={open}
				onClose={closeHandler}
				aria-labelledby="delete-title"
				aria-describedby="delete-description"
			>
				{isDeleting ? <LinearProgress /> : null}

				<ADD.ActionContainer>
					<DialogTitle id="delete-dialog-title">
						{<ADD.HeaderText>Delete {entityName}</ADD.HeaderText>}
					</DialogTitle>
					<ADD.ButtonContainer>
						<ADD.CancelButton onClick={closeHandler} variant="contained">
							Cancel
						</ADD.CancelButton>
						<ADD.DeleteButton onClick={handleDelete} variant="contained">
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
