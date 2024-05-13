import {
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
} from "@mui/material";
import React from "react";
import GeneralButton from "./GeneralButton";

// Init styled components

const DialogPopup = ({ open, closeHandler, message }) => {
	return (
		<Dialog open={open} onClose={closeHandler}>
			<DialogActions>
				<GeneralButton onClick={closeHandler} variant="contained">
					Close
				</GeneralButton>
			</DialogActions>
			<DialogContent>
				<DialogContentText>{message}</DialogContentText>
			</DialogContent>
		</Dialog>
	);
};

export default DialogPopup;
