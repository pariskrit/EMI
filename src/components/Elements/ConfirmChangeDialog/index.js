import {
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	LinearProgress,
} from "@mui/material";
import ColourConstants from "helpers/colourConstants";
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
				<AT.ConfirmButton
					onClick={handleChangeConfirm}
					variant="contained"
					sx={{
						"&.MuiButton-root:hover": {
							backgroundColor: ColourConstants.deleteDialogHover,
							color: "#ffffff",
						},
					}}
				>
					Confirm
				</AT.ConfirmButton>
				<AT.CancelButton
					onClick={closeHandler}
					variant="contained "
					sx={{
						"&.MuiButton-root:hover": {
							backgroundColor: ColourConstants.deleteDialogHover,
							color: "#ffffff",
						},
					}}
				>
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
