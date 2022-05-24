import {
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	LinearProgress,
} from "@material-ui/core";
import React from "react";
import AddDialogStyle from "styles/application/AddDialogStyle";

// Init styled components

const AT = AddDialogStyle();

const ConfirmChangeDialog = ({
	open,
	closeHandler,
	isUpdating,
	handleChangeConfirm,
	message = "You are about to change",
}) => {
	return (
		<Dialog open={open} onClose={closeHandler}>
			{isUpdating ? <LinearProgress /> : null}
			<DialogActions>
				<AT.ConfirmButton onClick={handleChangeConfirm} variant="contained">
					Confirm
				</AT.ConfirmButton>
				<AT.CancelButton onClick={closeHandler} variant="contained">
					Cancel
				</AT.CancelButton>
			</DialogActions>
			<DialogContent>
				<DialogContentText>{message}</DialogContentText>
			</DialogContent>
		</Dialog>
	);
};

export default ConfirmChangeDialog;
